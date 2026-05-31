/**
 * GRIND App — Section Header
 * Source: PRD v2.0 Design System
 *
 * Reusable section header with uppercase title,
 * optional count badge, horizontal divider, and ornament.
 */

import { View, Text } from 'react-native';
import StarHanddrawn from '@/assets/svg/doodles/star-handdrawn.svg';
import Sparkle4Point from '@/assets/svg/doodles/sparkle-4point.svg';
import Smiley from '@/assets/svg/doodles/smiley.svg';

interface SectionHeaderProps {
  /** Section title (rendered uppercase) */
  title: string;
  /** Optional count badge (number) */
  count?: number;
  /** Type of section to determine the ornament */
  type?: 'deadlines' | 'inbox';
}

export function SectionHeader({ title, count, type }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center mb-4 mt-6">
      <Text className="text-gray-500 text-xs font-semibold tracking-widest uppercase">
        {title}
      </Text>

      {count !== undefined && (
        <View className="bg-gray-800 rounded-sm w-5 h-5 items-center justify-center ml-2">
          <Text className="text-white text-[10px] font-bold">{count}</Text>
        </View>
      )}

      <View className="flex-1 h-[1px] bg-gray-700 mx-3" />

      {type === 'deadlines' && (
        <View className="opacity-70">
          <StarHanddrawn width={16} height={16} color="#888" />
        </View>
      )}

      {type === 'inbox' && (
        <View className="flex-row items-center gap-x-2 opacity-70">
          <Smiley width={18} height={18} color="#888" />
          <StarHanddrawn width={16} height={16} color="#888" style={{ marginTop: -8 }} />
        </View>
      )}
    </View>
  );
}
