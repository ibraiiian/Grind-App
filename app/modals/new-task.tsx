import { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

import { useUser } from '@/lib/clerk';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { colors } from '@/constants/colors';
import { Id } from '@/convex/_generated/dataModel';

// SVGs
import Sparkle4Point from '@/assets/svg/doodles/sparkle-4point.svg';
import DotGrid from '@/assets/svg/ui-elements/dot-grid.svg';

const taskSchema = z.object({
  title: z.string().min(1, 'Judul tidak boleh kosong').max(100),
  description: z.string().max(500).optional(),
  deadline: z.number(),
  folderId: z.string().min(1, 'Folder wajib dipilih'),
  tags: z.array(z.string()).max(5),
  isUrgent: z.boolean(),
});

export default function NewTaskModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ folderId?: Id<'folders'> }>();
  const { user } = useUser();
  const createTask = useMutation(api.tasks.createTask);
  const folders = useQuery(api.folders.listFolders, { userId: user?.id ?? '' });
  
  const folderSheetRef = useRef<BottomSheetModal>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date>(new Date(Date.now() + 86400000)); // Default +1 day
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [folderId, setFolderId] = useState<string>(params.folderId || '');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      if (tags.length >= 5) {
        Toast.show({ text1: 'Maksimal 5 tags', type: 'error' });
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
      description: description.trim() || undefined,
      deadline: deadline.getTime(),
      folderId,
      tags,
      isUrgent,
    };

    const parsed = taskSchema.safeParse(formData);
    
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      await createTask({
        userId: user?.id ?? '',
        folderId: parsed.data.folderId as Id<'folders'>,
        title: parsed.data.title,
        description: parsed.data.description,
        deadline: parsed.data.deadline,
        status: 'TODO',
        tags: parsed.data.tags,
        isUrgent: parsed.data.isUrgent,
      });
      Toast.show({ text1: 'Task berhasil ditambahkan', type: 'success' });
      router.back();
    } catch (err) {
      Toast.show({ text1: 'Gagal tambah task', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} · ${h}:${m}`;
  };

  const selectedFolder = folders?.find(f => f._id === folderId);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 justify-end bg-black/60"
    >
      <View className="bg-black w-full h-[90%] rounded-t-3xl border-t border-gray-800">
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          {/* HANDLE & HEADER */}
          <View className="w-10 h-1 bg-gray-600 rounded-full mx-auto mt-1 mb-6" />
          
          <View className="flex-row items-center justify-between mb-8 relative">
            <View className="flex-row items-center">
              <Text className="font-black text-3xl text-white">new task.</Text>
            </View>
            <View className="absolute right-12 top-[-5px]">
              <Sparkle4Point width={24} height={24} color={colors.gray500} />
            </View>
            <TouchableOpacity onPress={() => router.back()} className="w-8 h-8 items-center justify-center bg-gray-900 rounded-full">
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* FIELD 1: JUDUL */}
          <View className="mb-4">
            <TextInput
              className={`bg-gray-900 border ${errors.title ? 'border-red-500' : 'border-gray-700'} rounded-xl h-14 px-4 font-medium text-white text-base`}
              placeholder="what needs to get done?"
              placeholderTextColor={colors.gray500}
              value={title}
              onChangeText={(txt) => { setTitle(txt); setErrors({...errors, title: ''}); }}
              autoFocus={true}
            />
            {errors.title ? <Text className="text-red-500 text-xs mt-1 ml-2">{errors.title}</Text> : null}
          </View>

          {/* FIELD 2: DESKRIPSI */}
          <View className="mb-4 relative">
            <TextInput
              className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-base min-h-[80px] max-h-[120px]"
              placeholder="add details... (optional)"
              placeholderTextColor={colors.gray500}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
            <View className="absolute bottom-2 right-3 opacity-30">
              <Ionicons name="resize" size={16} color="white" style={{ transform: [{ rotate: '90deg' }] }} />
            </View>
          </View>

          {/* FIELD 3: DEADLINE */}
          <View className="mb-4">
            {Platform.OS === 'web' ? (
              <View className="bg-gray-900 border border-gray-700 rounded-xl h-14 px-4 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Ionicons name="calendar-outline" size={20} color={colors.gray500} className="mr-3" />
                  {/* @ts-ignore */}
                  <input
                    type="datetime-local"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: 'none',
                      outline: 'none',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                    min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                    value={new Date(deadline.getTime() - deadline.getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                    onChange={(e: any) => {
                      if (e.target.value) {
                        setDeadline(new Date(e.target.value));
                      }
                    }}
                  />
                </View>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  className="bg-gray-900 border border-gray-700 rounded-xl h-14 px-4 flex-row items-center justify-between"
                  onPress={() => setShowDatePicker(true)}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={20} color={colors.gray500} className="mr-3" />
                    <Text className="text-white text-base font-medium">{formatDate(deadline)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.gray500} />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={deadline}
                    mode="datetime"
                    minimumDate={new Date()}
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDeadline(selectedDate);
                    }}
                  />
                )}
              </>
            )}
          </View>

          {/* FIELD 4: FOLDER */}
          <View className="mb-4">
            <TouchableOpacity
              className={`bg-gray-900 border ${errors.folderId ? 'border-red-500' : 'border-gray-700'} rounded-xl h-14 px-4 flex-row items-center justify-between`}
              onPress={() => folderSheetRef.current?.present()}
            >
              <View className="flex-row items-center">
                <Ionicons name="folder-outline" size={20} color={colors.gray500} className="mr-3" />
                {selectedFolder ? (
                  <View className="flex-row items-center">
                    <View className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: selectedFolder.colorHex || '#888' }} />
                    <Text className="text-white text-base font-medium">{selectedFolder.name}</Text>
                  </View>
                ) : (
                  <Text className="text-gray-500 text-base font-medium">choose folder</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gray500} />
            </TouchableOpacity>
            {errors.folderId ? <Text className="text-red-500 text-xs mt-1 ml-2">{errors.folderId}</Text> : null}
          </View>

          {/* FIELD 5: TAGS */}
          <View className="mb-4 bg-gray-900 rounded-xl px-3 py-3 min-h-[52px] relative overflow-hidden">
            <View className="absolute right-0 top-0 opacity-20 pointer-events-none">
              <DotGrid width={60} height={60} color="#fff" />
            </View>
            <View className="flex-row flex-wrap items-center gap-2 relative z-10">
              {tags.map((t) => (
                <View key={t} className="bg-gray-800 border border-gray-700 rounded-full px-3 py-1.5 flex-row items-center">
                  <Text className="text-white text-sm font-medium mr-1.5">{t}</Text>
                  <TouchableOpacity onPress={() => removeTag(t)}>
                    <Ionicons name="close" size={14} color={colors.gray500} />
                  </TouchableOpacity>
                </View>
              ))}
              {tags.length < 5 && (
                <View className="flex-row items-center">
                  <TextInput
                    className="text-white text-sm font-medium w-24 h-8"
                    placeholder="+ add tag"
                    placeholderTextColor={colors.gray500}
                    value={tagInput}
                    onChangeText={setTagInput}
                    onSubmitEditing={handleAddTag}
                    returnKeyType="done"
                    blurOnSubmit={false}
                  />
                </View>
              )}
            </View>
          </View>

          {/* FIELD 6: URGENT TOGGLE */}
          <View className="mb-8">
            <View className="bg-gray-900 border border-gray-700 rounded-xl h-14 px-4 flex-row items-center justify-between">
              <Text className="text-white text-base font-medium">mark as urgent?</Text>
              
              <View className="flex-row items-center">
                <Text className={`text-xs font-bold mr-3 ${isUrgent ? 'text-white' : 'text-gray-500'}`}>
                  {isUrgent ? 'ON' : 'OFF'}
                </Text>
                <TouchableOpacity
                  className={`w-12 h-6 rounded-full justify-center px-1 ${isUrgent ? 'bg-red-500' : 'bg-gray-700'}`}
                  activeOpacity={0.8}
                  onPress={() => setIsUrgent(!isUrgent)}
                >
                  <View 
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                    style={{
                      transform: [{ translateX: isUrgent ? 24 : 0 }],
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* CTA BUTTON */}
          <TouchableOpacity
            className={`bg-white h-14 rounded-xl items-center justify-center flex-row shadow-sm ${
              (!title.trim() || loading) ? 'opacity-40' : 'opacity-100'
            }`}
            disabled={!title.trim() || loading}
            onPress={handleSubmit}
          >
            {loading ? (
              <ActivityIndicator color="black" />
            ) : (
              <>
                <Text className="text-black font-black text-lg">add task</Text>
                <Ionicons name="arrow-forward" size={20} color="black" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* NESTED FOLDER BOTTOM SHEET */}
      <BottomSheetModal
        ref={folderSheetRef}
        snapPoints={['50%']}
        index={0}
        backgroundStyle={{ backgroundColor: colors.gray900 }}
        handleIndicatorStyle={{ backgroundColor: colors.gray500 }}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.7} />}
      >
        <View className="flex-1 px-5 pt-4">
          <Text className="text-white text-xl font-bold mb-4">Select Folder</Text>
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            {folders?.map((f: any) => (
              <GHTouchableOpacity 
                key={f._id}
                className="flex-row items-center py-4 border-b border-gray-800"
                onPress={() => {
                  setFolderId(f._id);
                  setErrors({...errors, folderId: ''});
                  folderSheetRef.current?.dismiss();
                }}
              >
                <View className="w-8 items-center justify-center">
                   <View className="w-3 h-3 rounded-full" style={{ backgroundColor: f.colorHex || '#888' }} />
                </View>
                <Text className="text-base text-white font-medium">{f.name}</Text>
              </GHTouchableOpacity>
            ))}
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    </KeyboardAvoidingView>
  );
}
