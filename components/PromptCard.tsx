import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Id } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';
import { parseVariables } from '@/lib/prompt-parser';
import { FOLDER_ICONS, FolderIconKey } from '@/constants/icons';

type PromptCardProps = {
  prompt: {
    _id: Id<'aiPrompts'>;
    title: string;
    promptTemplate: string;
    tags: string[];
    icon: string;
  };
  onFillAndCopy: () => void;
  onCopyRaw: () => void;
  onLongPress?: () => void;
};

function PromptCardComponent({ prompt, onFillAndCopy, onCopyRaw, onLongPress }: PromptCardProps) {
  const varsCount = parseVariables(prompt.promptTemplate).length;
  const iconName = FOLDER_ICONS[prompt.icon as FolderIconKey] || FOLDER_ICONS['star'];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onFillAndCopy}
      onLongPress={onLongPress}
      className="bg-gray-950 border border-gray-700 rounded-2xl p-4 overflow-hidden"
    >
      {/* HEADER ROW */}
      <View className="flex-row items-start gap-3">
        <View className="w-8 h-8 rounded-lg bg-gray-800 items-center justify-center">
          <Ionicons name={iconName as any} size={18} color="white" />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-white text-base leading-tight">{prompt.title}</Text>
          <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={2}>
            {prompt.promptTemplate}
          </Text>
        </View>
        {varsCount > 0 && (
          <View className="border border-gray-700 rounded-md px-2 py-0.5 ml-2">
            <Text className="text-xs text-gray-400">
              {varsCount === 1 ? '1 var' : `${varsCount} vars`}
            </Text>
          </View>
        )}
      </View>

      {/* TAGS ROW */}
      {prompt.tags && prompt.tags.length > 0 && (
        <View className="mt-2 mb-3">
          <Text className="text-xs text-gray-600">
            {prompt.tags.join(' · ')}
          </Text>
        </View>
      )}
      
      {(!prompt.tags || prompt.tags.length === 0) && (
         <View className="mt-3 mb-0" />
      )}

      {/* DIVIDER */}
      <View className="h-px bg-gray-700 mb-3" />

      {/* ACTION ROW */}
      <View className="flex-row items-center h-11">
        <TouchableOpacity
          className="flex-1 flex-row items-center"
          onPress={onFillAndCopy}
        >
          <Text className="text-sm font-semibold text-white mr-2">fill & copy</Text>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>

        <View className="w-px h-5 bg-gray-700" />

        <TouchableOpacity
          className="pl-4 py-2"
          onPress={onCopyRaw}
        >
          <Ionicons name="copy-outline" size={18} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export const PromptCard = React.memo(PromptCardComponent, (prev, next) =>
  prev.prompt._id === next.prompt._id &&
  prev.prompt.title === next.prompt.title &&
  prev.prompt.promptTemplate === next.prompt.promptTemplate &&
  JSON.stringify(prev.prompt.tags) === JSON.stringify(next.prompt.tags)
);
