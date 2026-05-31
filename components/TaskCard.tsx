import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Id } from '@/convex/_generated/dataModel';
import { DeadlineBadge } from './DeadlineBadge';

type TaskCardProps = {
  task: {
    _id: Id<'tasks'>;
    title: string;
    description?: string;
    deadline: number;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    isUrgent: boolean;
    tags: string[];
    folderId: Id<'folders'>;
  };
  folderName?: string;
  showFolderName?: boolean;
  onToggleDone: () => void;
};

export function TaskCard({ task, folderName, showFolderName = false, onToggleDone }: TaskCardProps) {
  const isDone = task.status === 'DONE';

  return (
    <View className="bg-gray-950 rounded-xl border border-gray-800 px-4 py-3.5 flex-row items-center mb-3">
      {/* Checkbox */}
      <TouchableOpacity
        className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
          isDone ? 'bg-white border-white' : 'border-gray-500'
        }`}
        onPress={onToggleDone}
        activeOpacity={0.7}
      >
        {isDone && <Ionicons name="checkmark" size={16} color="black" />}
      </TouchableOpacity>

      {/* Content */}
      <View className="flex-1 mr-2">
        <Text
          className={`font-bold text-base ${isDone ? 'text-gray-500 line-through' : 'text-white'}`}
        >
          {task.title}
        </Text>
        {showFolderName && folderName ? (
          <Text className="text-xs text-gray-500 mt-0.5">{folderName}</Text>
        ) : task.description ? (
          <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
            {task.description}
          </Text>
        ) : null}
      </View>

      {/* Badge */}
      <DeadlineBadge
        deadline={task.deadline}
        status={task.status}
        isUrgent={task.isUrgent}
      />
    </View>
  );
}
