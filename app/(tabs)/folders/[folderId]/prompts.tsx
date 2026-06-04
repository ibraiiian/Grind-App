import { useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { Id } from '@/convex/_generated/dataModel';

import { usePromptsByFolder, useAllPrompts } from '@/hooks/usePrompts';
import { PromptCard } from '@/components/PromptCard';
import { AddPromptSheet, AddPromptSheetRef } from '@/components/AddPromptSheet';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';

// SVGs
import BurstLines from '@/assets/svg/doodles/burst-lines.svg';

export default function FolderPromptsScreen() {
  const { folderId } = useLocalSearchParams<{ folderId: Id<'folders'> }>();
  const router = useRouter();

  const { prompts } = usePromptsByFolder(folderId);
  const { deletePrompt } = useAllPrompts(); // for delete mutation
  
  const addPromptSheetRef = useRef<AddPromptSheetRef>(null);

  const handleCopyRaw = async (template: string) => {
    await Clipboard.setStringAsync(template);
    Toast.show({ text1: 'Copied!', text2: 'Template disalin tanpa isi variabel', type: 'info' });
  };

  const handleLongPress = (id: any, title: string) => {
    Alert.alert(
      'Prompt Options',
      `Manage "${title}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Edit', 
          onPress: () => Alert.alert('Coming soon', 'Edit prompt will be in next update.')
        },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Hapus Prompt?',
              'Tindakan ini tidak bisa dibatalkan.',
              [
                { text: 'Batal', style: 'cancel' },
                { text: 'Hapus', style: 'destructive', onPress: () => deletePrompt({ id }) }
              ]
            );
          }
        },
      ]
    );
  };

  return (
    <View className="flex-1 px-5 pt-4">
      {prompts === undefined ? (
        <LoadingSkeleton rows={4} />
      ) : prompts.length === 0 ? (
        <EmptyState message="Belum ada prompt di folder ini." />
      ) : (
        <FlatList
          data={prompts}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <PromptCard
              prompt={item as any}
              onFillAndCopy={() => router.push(`/modals/prompt-fill?promptId=${item._id}`)}
              onCopyRaw={() => handleCopyRaw(item.promptTemplate)}
              onLongPress={() => handleLongPress(item._id, item.title)}
            />
          )}
        />
      )}

      {/* FAB BUTTON */}
      <View className="absolute bottom-6 right-6">
        <View className="absolute -top-4 -left-4 opacity-90 rotate-[-15deg]">
          <BurstLines width={32} height={32} color="#fff" />
        </View>
        <TouchableOpacity
          className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg"
          onPress={() => addPromptSheetRef.current?.present()}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <AddPromptSheet ref={addPromptSheetRef} />
    </View>
  );
}
