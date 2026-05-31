/**
 * GRIND App — Section Header
 * Source: PRD v2.0 Design System
 *
 * Reusable section header with uppercase title,
 * optional count badge, horizontal divider, and ornament.
 */

import { View, Text } from 'react-native';

interface SectionHeaderProps {
  /** Section title (rendered uppercase) */
  title: string;
  /** Optional count badge (number) */
  count?: number;
  /** Optional ornament character (e.g. '✦', '☺') */
  ornament?: string;
}

export function SectionHeader({ title, count, ornament }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center mb-3 mt-6">
      <Text className="text-gray-500 text-xs font-semibold tracking-widest uppercase">
        {title}
      </Text>

      {count !== undefined && (
        <View className="bg-white rounded-full w-5 h-5 items-center justify-center ml-2">
          <Text className="text-black text-[10px] font-bold">{count}</Text>
        </View>
      )}

      <View className="flex-1 h-[1px] bg-gray-700 mx-3" />

      {ornament && (
        <Text className="text-gray-500 text-sm">{ornament}</Text>
      )}
    </View>
  );
}
