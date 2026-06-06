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
  onDelete: () => void;
};

export function NoteCard({ note, onPress, onDelete }: NoteCardProps) {
  const preview = note.content?.replace(/[#*`\[\]]/g, '').trim() ?? '';

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onDelete}
      className="bg-gray-950 border border-gray-700 rounded-xl px-4 py-3"
      activeOpacity={0.7}
    >
      <Text className="font-bold text-white text-base" numberOfLines={1}>
        {note.title || 'Untitled'}
      </Text>
      {preview.length > 0 && (
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
          {preview}
        </Text>
      )}
      <Text className="text-xs text-gray-700 mt-2">
        {formatRelativeTime(note._creationTime)}
      </Text>
    </TouchableOpacity>
  );
}
