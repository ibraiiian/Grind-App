import { View, Text, TouchableOpacity } from 'react-native';
import { Id } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';

type PromptCardProps = {
  prompt: {
    _id: Id<'aiPrompts'>;
    title: string;
  };
  onPress: () => void;
};

export function PromptCard({ prompt, onPress }: PromptCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="bg-gray-950 border border-gray-700 rounded-xl px-4 py-3.5 flex-row items-center justify-between mb-3"
    >
      <View className="flex-1 mr-3">
        <Text className="font-bold text-white text-base" numberOfLines={1}>
          {prompt.title}
        </Text>
      </View>
      <View className="flex-row items-center bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5">
        <Text className="text-gray-400 text-xs font-medium mr-1">fill & copy</Text>
        <Ionicons name="arrow-forward" size={14} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
}
