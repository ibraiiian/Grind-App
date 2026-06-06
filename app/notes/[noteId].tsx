import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Id } from '@/convex/_generated/dataModel';
import { useNote } from '@/hooks/useNotes';

export default function NoteEditorScreen() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { note } = useNote(noteId as Id<'notes'>);

  return (
    <View className="flex-1 bg-black items-center justify-center">
      <Text className="text-white font-bold text-lg">
        {note ? note.title : 'Loading...'}
      </Text>
    </View>
  );
}
