import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FOLDER_ICONS, FolderIconKey } from '@/constants/icons';
import { Id } from '@/convex/_generated/dataModel';

type FolderCardProps = {
  folder: {
    _id: Id<'folders'>;
    name: string;
    colorHex: string;
    icon: string; // The schema has it as string, so we cast to FolderIconKey internally
  };
  taskCount: number;
  noteCount: number;
  onPress: () => void;
  onLongPress: () => void;
};

function FolderCardComponent({ folder, taskCount, noteCount, onPress, onLongPress }: FolderCardProps) {
  const iconName = FOLDER_ICONS[folder.icon as FolderIconKey] || 'ribbon-outline';

  const taskText = taskCount === 1 ? '1 task' : `${taskCount} tasks`;
  const noteText = noteCount === 1 ? '1 note' : `${noteCount} notes`;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={onLongPress}
      className="bg-gray-950 border border-gray-700 rounded-2xl p-3.5 flex-1"
      style={{ aspectRatio: 0.9, minWidth: '47%' }}
    >
      <View className="flex-row justify-between items-start">
        <View
          className="w-2.5 h-2.5 rounded-full mt-1"
          style={{ backgroundColor: folder.colorHex || '#FFFFFF' }}
        />
        <Ionicons name={iconName} size={22} color="white" />
      </View>

      <View className="mt-auto">
        <Text className="font-black text-white text-xl" numberOfLines={2}>
          {folder.name}
        </Text>
        <Text className="text-xs text-gray-500 mt-1">
          {taskText} · {noteText}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export const FolderCard = React.memo(FolderCardComponent, (prev, next) =>
  prev.folder._id === next.folder._id &&
  prev.folder.name === next.folder.name &&
  prev.folder.colorHex === next.folder.colorHex &&
  prev.folder.icon === next.folder.icon &&
  prev.taskCount === next.taskCount &&
  prev.noteCount === next.noteCount
);
