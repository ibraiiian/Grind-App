import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Id } from '@/convex/_generated/dataModel';

// TODO: Import usePrompts when created
// import { usePrompts } from '@/hooks/usePrompts';
import { PromptCard } from '@/components/PromptCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';

export default function FolderPromptsScreen() {
  const { folderId } = useLocalSearchParams<{ folderId: Id<'folders'> }>();
  const router = useRouter();

  // const { listByFolder } = usePrompts();
  // const prompts = listByFolder(folderId);
  const prompts: any[] = []; // Placeholder until usePrompts is fully implemented

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
          renderItem={({ item }) => (
            <PromptCard
              prompt={item}
              onPress={() => {
                // handle prompt click
              }}
            />
          )}
        />
      )}

      {/* FAB BUTTON */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg"
          onPress={() => {
            // navigate to create prompt
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
