import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
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
  onDelete?: () => void;
};

function TaskCardComponent({ task, folderName, showFolderName = false, onToggleDone, onDelete }: TaskCardProps) {
  const isDone = task.status === 'DONE';

  const renderRightActions = (progress: any, dragX: any) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity 
        className="bg-red-600 justify-center items-center w-20 rounded-xl mb-3 ml-2"
        onPress={onDelete}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={onDelete ? renderRightActions : undefined}>
    <View 
      className={`bg-black rounded-xl border border-gray-700 px-4 py-4 flex-row items-center mb-3 ${
        task.isUrgent && !isDone ? 'border-l-[4px] border-l-red-600' : ''
      }`}
    >
      {/* Checkbox */}
      <TouchableOpacity
        className={`w-6 h-6 rounded-full border mr-4 items-center justify-center ${
          isDone ? 'bg-white border-white' : 'border-gray-400 bg-transparent'
        }`}
        onPress={onToggleDone}
        activeOpacity={0.7}
      >
        {isDone && <Ionicons name="checkmark" size={16} color="black" />}
      </TouchableOpacity>

      {/* Content */}
      <View className="flex-1 mr-3 justify-center">
        <Text
          className={`font-bold text-[17px] ${isDone ? 'text-gray-500 line-through' : 'text-white'}`}
        >
          {task.title}
        </Text>
        {showFolderName && folderName ? (
          <Text className="text-[13px] text-gray-500 mt-1">{folderName}</Text>
        ) : task.description ? (
          <Text className="text-[13px] text-gray-500 mt-1" numberOfLines={1}>
            {task.description}
          </Text>
        ) : null}
      </View>

      <DeadlineBadge
        deadline={task.deadline}
        status={task.status}
        isUrgent={task.isUrgent}
      />
    </View>
    </Swipeable>
  );
}

export const TaskCard = React.memo(TaskCardComponent, (prev, next) =>
  prev.task._id === next.task._id &&
  prev.task.status === next.task.status &&
  prev.task.deadline === next.task.deadline &&
  prev.task.isUrgent === next.task.isUrgent &&
  prev.task.title === next.task.title
);
