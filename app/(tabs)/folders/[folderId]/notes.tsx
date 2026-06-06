import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Id } from '@/convex/_generated/dataModel';

import { useNotes } from '@/hooks/useNotes';
import { useUser } from '@/lib/clerk';
import { NoteCard } from '@/components/NoteCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';

export default function FolderNotesScreen() {
  const { folderId } = useLocalSearchParams<{ folderId: string }>();
  const { user } = useUser();
  const router = useRouter();
  const { notes, createNote, deleteNote } = useNotes(folderId as Id<'folders'>);

  const handleCreateNote = async () => {
    if (!user) return;
    try {
      const noteId = await createNote({
        folderId: folderId as Id<'folders'>,
        userId: user.id,
        title: 'Catatan baru',
        content: '',
      });
      // Navigate langsung ke editor
      router.push(`/notes/${noteId}`);
    } catch (err) {
      console.error('Gagal buat note:', err);
    }
  };

  if (notes === undefined) return (
    <View className="flex-1 bg-black px-5 pt-4">
      <LoadingSkeleton variant="note-list" count={4} />
    </View>
  );

  if (notes.length === 0) return (
    <View className="flex-1 bg-black px-5 pt-4">
      <EmptyState type="notes" />
      <TouchableOpacity
        onPress={handleCreateNote}
        className="absolute bottom-6 right-6 w-14 h-14 bg-white
                   rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-black px-5 pt-4">
      <FlatList
        data={notes}
        keyExtractor={(item) => item._id}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={8}
        getItemLayout={undefined}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => router.push(`/notes/${item._id}`)}
            onDelete={() => Alert.alert(
              'Hapus Catatan',
              `Hapus "${item.title}"?`,
              [
                { text: 'Batal', style: 'cancel' },
                { text: 'Hapus', style: 'destructive',
                  onPress: () => deleteNote({ id: item._id }) }
              ]
            )}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        showsVerticalScrollIndicator={false}
      />
      {/* FAB */}
      <TouchableOpacity
        onPress={handleCreateNote}
        className="absolute bottom-6 right-6 w-14 h-14 bg-white
                   rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
}
