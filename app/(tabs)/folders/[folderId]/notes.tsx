import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Id } from '@/convex/_generated/dataModel';

// TODO: Import useNotes when created
// import { useNotes } from '@/hooks/useNotes';
import { NoteCard } from '@/components/NoteCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';

export default function FolderNotesScreen() {
  const { folderId } = useLocalSearchParams<{ folderId: Id<'folders'> }>();
  const router = useRouter();

  // const { notes } = useNotes(folderId);
  const notes: any[] = []; // Placeholder until useNotes is fully implemented

  return (
    <View className="flex-1 px-5 pt-4">
      {notes === undefined ? (
        <LoadingSkeleton rows={4} />
      ) : notes.length === 0 ? (
        <EmptyState message="Belum ada catatan di folder ini." />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() => router.push(`/notes/${item._id}`)}
            />
          )}
        />
      )}

      {/* FAB BUTTON */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg"
          onPress={() => {
            // navigate to create note
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
