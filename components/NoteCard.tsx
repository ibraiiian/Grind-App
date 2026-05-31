import { View, Text, TouchableOpacity } from 'react-native';
import { Id } from '@/convex/_generated/dataModel';
import { formatRelativeTime } from '@/lib/utils';

type NoteCardProps = {
  note: {
    _id: Id<'notes'>;
    title: string;
    content?: string;
    _creationTime: number;
  };
  onPress: () => void;
};

export function NoteCard({ note, onPress }: NoteCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 mb-3"
    >
      <Text className="font-bold text-white text-base" numberOfLines={1}>
        {note.title}
      </Text>
      <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={2}>
        {note.content || 'No content'}
      </Text>
      <Text className="text-xs text-gray-600 mt-2">
        {formatRelativeTime(note._creationTime)}
      </Text>
    </TouchableOpacity>
  );
}
