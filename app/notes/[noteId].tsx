import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Id } from '@/convex/_generated/dataModel';
import { useNote } from '@/hooks/useNotes';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { NoteToolbar, TOOLS } from '@/components/NoteToolbar';

// ────────────────────────────────────
// Animated saving dots component
// ────────────────────────────────────
function SavingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const createPulse = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      );

    const a1 = createPulse(dot1, 0);
    const a2 = createPulse(dot2, 200);
    const a3 = createPulse(dot3, 400);

    a1.start();
    a2.start();
    a3.start();

    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  const dotStyle = (opacity: Animated.Value) => ({
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#6B7280',
    marginHorizontal: 2,
    opacity,
  });

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 4 }}>
      <Animated.View style={dotStyle(dot1)} />
      <Animated.View style={dotStyle(dot2)} />
      <Animated.View style={dotStyle(dot3)} />
    </View>
  );
}

// ────────────────────────────────────
// Note Editor Screen
// ────────────────────────────────────
export default function NoteEditorScreen() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const router = useRouter();

  const { note, updateNote } = useNote(noteId as Id<'notes'>);
  const deleteNote = useMutation(api.notes.deleteNote);

  // ── State ──
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isPreview, setIsPreview] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const isInitialized = useRef(false);
  const textInputRef = useRef<TextInput>(null);

  // ── Init from Convex data (once) ──
  useEffect(() => {
    if (note && !isInitialized.current) {
      setTitle(note.title ?? '');
      setContent(note.content ?? '');
      isInitialized.current = true;
    }
  }, [note]);

  // ── Auto-save with debounce 1500ms ──
  const [debouncedTitle] = useDebounce(title, 1500);
  const [debouncedContent] = useDebounce(content, 1500);

  useEffect(() => {
    if (!note || !isInitialized.current) return;
    if (debouncedTitle === (note.title ?? '') && debouncedContent === (note.content ?? '')) return;

    const save = async () => {
      setSaveStatus('saving');
      try {
        await updateNote({
          id: note._id,
          title: debouncedTitle || 'Untitled',
          content: debouncedContent,
        });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch {
        setSaveStatus('error');
      }
    };

    save();
  }, [debouncedTitle, debouncedContent]);

  // ── Insert markdown syntax handler ──
  const handleInsert = useCallback((toolKey: string) => {
    const tool = TOOLS.find(t => t.key === toolKey);
    if (!tool) return;

    const selectedText = content.slice(selection.start, selection.end);
    const before = content.slice(0, selection.start);
    const after = content.slice(selection.end);

    let newText: string;
    let newCursorPos: number;

    if (tool.block) {
      // Block element: insert at line start
      const lineStart = before.lastIndexOf('\n') + 1;
      const beforeLine = content.slice(0, lineStart);
      const lineEnd = selection.end === selection.start
        ? (content.indexOf('\n', lineStart) === -1 ? content.length : content.indexOf('\n', lineStart))
        : selection.end;
      const line = content.slice(lineStart, lineEnd);
      const afterLine = content.slice(lineEnd);
      newText = beforeLine + tool.prefix + line + afterLine;
      newCursorPos = lineStart + tool.prefix.length + line.length;
    } else {
      // Inline element: wrap selection
      if (selectedText) {
        newText = before + tool.prefix + selectedText + tool.suffix + after;
        newCursorPos = selection.start + tool.prefix.length + selectedText.length + tool.suffix.length;
      } else {
        newText = before + tool.prefix + tool.suffix + after;
        newCursorPos = selection.start + tool.prefix.length;
      }
    }

    setContent(newText);
    setTimeout(() => {
      textInputRef.current?.focus();
      setSelection({ start: newCursorPos, end: newCursorPos });
    }, 50);
  }, [content, selection]);

  // ── 3-dots action sheet ──
  const handleMoreOptions = useCallback(() => {
    Alert.alert('Opsi Catatan', undefined, [
      {
        text: 'Hapus Catatan',
        style: 'destructive',
        onPress: () =>
          Alert.alert(
            'Hapus Catatan',
            'Catatan ini akan dihapus permanen.',
            [
              { text: 'Batal', style: 'cancel' },
              {
                text: 'Hapus',
                style: 'destructive',
                onPress: async () => {
                  await deleteNote({ id: note!._id });
                  router.back();
                },
              },
            ]
          ),
      },
      { text: 'Batal', style: 'cancel' },
    ]);
  }, [note, deleteNote, router]);

  // ── Loading state ──
  if (!note) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-gray-500 text-base">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1">

          {/* ════════════════════════════
              HEADER ROW
          ════════════════════════════ */}
          <View className="flex-row items-center px-4 h-14 border-b border-gray-900">
            {/* Back button */}
            <TouchableOpacity onPress={() => router.back()} className="mr-2">
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>

            {/* Title input */}
            <TextInput
              className="flex-1 mx-3 text-center font-bold text-base text-white"
              placeholder="judul catatan..."
              placeholderTextColor="#6B7280"
              value={title}
              onChangeText={setTitle}
              returnKeyType="done"
              blurOnSubmit
            />

            {/* Eye toggle (preview) */}
            <TouchableOpacity onPress={() => setIsPreview(!isPreview)} className="mx-1.5">
              <Ionicons
                name={isPreview ? 'eye' : 'eye-outline'}
                size={20}
                color={isPreview ? 'white' : '#6B7280'}
              />
            </TouchableOpacity>

            {/* 3-dots menu */}
            <TouchableOpacity onPress={handleMoreOptions} className="ml-1.5">
              <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* ════════════════════════════
              SAVING INDICATOR ROW
          ════════════════════════════ */}
          <View className="px-4 h-6 flex-row items-center">
            {saveStatus === 'saving' && (
              <View className="flex-row items-center">
                <Text className="text-xs text-gray-600">saving</Text>
                <SavingDots />
              </View>
            )}
            {saveStatus === 'saved' && (
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={12} color="#4B5563" style={{ marginRight: 4 }} />
                <Text className="text-xs text-gray-600">tersimpan</Text>
              </View>
            )}
            {saveStatus === 'error' && (
              <Text className="text-xs text-red-500">gagal menyimpan</Text>
            )}
            {/* idle → empty view (keeps height stable) */}
          </View>

          {/* ════════════════════════════
              FORMATTING TOOLBAR
          ════════════════════════════ */}
          <NoteToolbar onInsert={handleInsert} />

          {/* ════════════════════════════
              CONTENT AREA
          ════════════════════════════ */}
          <TextInput
            ref={textInputRef}
            className="flex-1 px-4 py-4 text-white text-base leading-6"
            placeholder="mulai menulis..."
            placeholderTextColor="#4B5563"
            multiline
            textAlignVertical="top"
            scrollEnabled
            value={content}
            onChangeText={setContent}
            selection={selection}
            onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
            style={{
              fontFamily: Platform.select({
                ios: 'Courier New',
                android: 'monospace',
                default: 'monospace',
              }),
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
