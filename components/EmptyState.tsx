/**
 * GRIND App — Empty State
 * Source: PRD v2.0 Section 7.5
 *
 * Shown when a list has no items.
 * Centered layout with optional doodle ornament.
 */

import { View, Text } from 'react-native';

interface EmptyStateProps {
  /** Message to display */
  message: string;
  /** Optional emoji/ornament icon */
  icon?: string;
}

export function EmptyState({ message, icon = '✦' }: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-12 px-6">
      <Text className="text-gray-500 text-2xl mb-3">{icon}</Text>
      <Text className="text-gray-500 text-sm text-center">{message}</Text>
    </View>
  );
}
