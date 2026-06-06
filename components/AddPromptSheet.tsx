import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';
import { toast } from '@/lib/toast';

import { useUser } from '@/lib/clerk';
import { useAllPrompts } from '@/hooks/usePrompts';
import { useFolders } from '@/hooks/useFolders';
import { FOLDER_ICONS, FolderIconKey } from '@/constants/icons';
import { Id } from '@/convex/_generated/dataModel';

// SVGs
import DotGrid from '@/assets/svg/ui-elements/dot-grid.svg';

const promptSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(80),
  promptTemplate: z.string().min(1, 'Template wajib diisi').max(2000),
  tags: z.array(z.string()).max(5),
  icon: z.string(),
  folderId: z.string().optional(),
});

export type AddPromptSheetRef = {
  present: () => void;
  dismiss: () => void;
};

export const AddPromptSheet = forwardRef<AddPromptSheetRef>((props, ref) => {
  const { user } = useUser();
  const { createPrompt } = useAllPrompts();
  const { folders } = useFolders();

  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    present: () => setVisible(true),
    dismiss: () => setVisible(false),
  }));

  const [title, setTitle] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [icon, setIcon] = useState<FolderIconKey>('star');
  const [folderId, setFolderId] = useState<string>('');
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showFolderSelector, setShowFolderSelector] = useState(false);

  const resetForm = () => {
    setTitle('');
    setPromptTemplate('');
    setTags([]);
    setTagInput('');
    setIcon('star');
    setFolderId('');
    setErrors({});
    setShowFolderSelector(false);
  };

  const handleClose = () => {
    resetForm();
    setVisible(false);
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      if (tags.length >= 5) {
        toast.error('Maksimal 5 tags');
      } else {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter(tag => tag !== t));
  };

  const handleSubmit = async () => {
    setErrors({});
    const formData = {
      title: title.trim(),
      promptTemplate: promptTemplate.trim(),
      tags,
      icon,
      folderId: folderId || undefined,
    };

    const parsed = promptSchema.safeParse(formData);
    
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err: any) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      await createPrompt({
        userId: user?.id ?? '',
        folderId: parsed.data.folderId as Id<'folders'> | undefined,
        title: parsed.data.title,
        promptTemplate: parsed.data.promptTemplate,
        tags: parsed.data.tags,
        icon: parsed.data.icon,
      });
      
      toast.success('Prompt berhasil disimpan!');
      resetForm();
      setVisible(false);
    } catch (err) {
      toast.error('Gagal menyimpan prompt');
    } finally {
      setLoading(false);
    }
  };

  const activeFolder = folders?.find(f => f._id === folderId);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}
        activeOpacity={1}
        onPress={handleClose}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
      >
        <View style={{ backgroundColor: '#000', borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderColor: '#1F2937', maxHeight: '90%' }}>
          {/* Handle */}
          <View style={{ width: 40, height: 4, backgroundColor: '#4B5563', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 20 }} />

          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 }}>
            <Text style={{ fontWeight: '900', fontSize: 22, color: 'white' }}>new prompt.</Text>
            <TouchableOpacity onPress={handleClose} style={{ width: 32, height: 32, backgroundColor: '#111827', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* FIELD 1: JUDUL */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 }}>judul</Text>
              <TextInput
                style={{
                  backgroundColor: '#111827',
                  borderWidth: 1,
                  borderColor: errors.title ? '#EF4444' : '#374151',
                  borderRadius: 12,
                  height: 56,
                  paddingHorizontal: 16,
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '500',
                }}
                placeholder="Debug this code, Summarize Paper..."
                placeholderTextColor="#6B7280"
                value={title}
                onChangeText={(txt) => { setTitle(txt); setErrors({...errors, title: ''}); }}
                autoFocus
              />
              {errors.title && <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4 }}>{errors.title}</Text>}
            </View>

            {/* FIELD 2: TEMPLATE */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 }}>template</Text>
              <TextInput
                style={{
                  backgroundColor: '#111827',
                  borderWidth: 1,
                  borderColor: errors.promptTemplate ? '#EF4444' : '#374151',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  color: 'white',
                  fontSize: 14,
                  minHeight: 120,
                  fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }),
                }}
                placeholder={'You are a {{role}}. Review the {{code}} and...'}
                placeholderTextColor="#6B7280"
                value={promptTemplate}
                onChangeText={(txt) => { setPromptTemplate(txt); setErrors({...errors, promptTemplate: ''}); }}
                multiline
                textAlignVertical="top"
              />
              <Text style={{ fontSize: 12, color: '#4B5563', marginTop: 8, marginLeft: 4 }}>
                gunakan {'{{nama_variabel}}'} untuk bagian yang ingin diisi nanti
              </Text>
              {errors.promptTemplate && <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4 }}>{errors.promptTemplate}</Text>}
            </View>

            {/* FIELD 3: TAGS */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 }}>tags</Text>
              <View style={{ backgroundColor: '#111827', borderWidth: 1, borderColor: '#374151', borderRadius: 12, padding: 12, minHeight: 52 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                  {tags.map(t => (
                    <View key={t} style={{ backgroundColor: '#1F2937', borderWidth: 1, borderColor: '#4B5563', borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ color: 'white', fontSize: 13, fontWeight: '500', marginRight: 6 }}>{t}</Text>
                      <TouchableOpacity onPress={() => removeTag(t)}>
                        <Ionicons name="close" size={14} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {tags.length < 5 && (
                    <TextInput
                      style={{ color: 'white', fontSize: 13, fontWeight: '500', minWidth: 80, height: 32 }}
                      placeholder="+ add tag"
                      placeholderTextColor="#6B7280"
                      value={tagInput}
                      onChangeText={setTagInput}
                      onSubmitEditing={handleAddTag}
                      returnKeyType="done"
                      blurOnSubmit={false}
                    />
                  )}
                </View>
              </View>
            </View>

            {/* FIELD 4: ICON */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 }}>icon</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {(Object.keys(FOLDER_ICONS) as FolderIconKey[]).map(key => {
                  const iconName = FOLDER_ICONS[key];
                  const isSelected = icon === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => setIcon(key)}
                      style={{
                        width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: isSelected ? 'white' : '#1F2937',
                        backgroundColor: isSelected ? '#1F2937' : '#111827',
                      }}
                    >
                      <Ionicons name={iconName as any} size={24} color={isSelected ? 'white' : '#6B7280'} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* FIELD 5: FOLDER */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 }}>folder (opsional)</Text>
              {showFolderSelector ? (
                <View style={{ backgroundColor: '#111827', borderWidth: 1, borderColor: '#374151', borderRadius: 12, overflow: 'hidden', maxHeight: 200 }}>
                  <ScrollView nestedScrollEnabled>
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1F2937' }}
                      onPress={() => { setFolderId(''); setShowFolderSelector(false); }}
                    >
                      <Text style={{ fontSize: 15, color: '#9CA3AF', fontStyle: 'italic' }}>tanpa folder (global)</Text>
                    </TouchableOpacity>
                    {folders?.map(f => (
                      <TouchableOpacity
                        key={f._id}
                        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1F2937' }}
                        onPress={() => { setFolderId(f._id); setShowFolderSelector(false); }}
                      >
                        <View style={{ width: 12, height: 12, borderRadius: 6, marginRight: 12, backgroundColor: f.colorHex || '#888' }} />
                        <Text style={{ fontSize: 15, color: 'white', fontWeight: '500' }}>{f.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ) : (
                <TouchableOpacity
                  style={{ backgroundColor: '#111827', borderWidth: 1, borderColor: '#374151', borderRadius: 12, height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                  onPress={() => setShowFolderSelector(true)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="folder-outline" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
                    {activeFolder ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 10, height: 10, borderRadius: 5, marginRight: 8, backgroundColor: activeFolder.colorHex || '#888' }} />
                        <Text style={{ color: 'white', fontSize: 15, fontWeight: '500' }}>{activeFolder.name}</Text>
                      </View>
                    ) : (
                      <Text style={{ color: '#6B7280', fontSize: 15, fontWeight: '500' }}>pilih folder...</Text>
                    )}
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* CTA */}
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                height: 56,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                opacity: (!title.trim() || !promptTemplate.trim() || loading) ? 0.4 : 1,
              }}
              disabled={!title.trim() || !promptTemplate.trim() || loading}
              onPress={handleSubmit}
            >
              {loading ? (
                <ActivityIndicator color="black" />
              ) : (
                <>
                  <Text style={{ color: 'black', fontWeight: '900', fontSize: 18, marginRight: 8 }}>simpan prompt</Text>
                  <Ionicons name="arrow-forward" size={20} color="black" />
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});
