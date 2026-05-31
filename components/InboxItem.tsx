/**
 * GRIND App — Inbox Item
 * Source: PRD v2.0 Section 3.1 FR-1.4
 *
 * Pill-shaped inbox item with swipe actions.
 * Swipe left → delete (red)
 * Swipe right → process to folder (white)
 */

import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { colors } from '@/constants/colors';

interface InboxItemProps {
  item: {
    _id: string;
    content: string;
  };
  onDelete: () => void;
  onProcess: () => void;
}

function renderLeftActions() {
  return (
    <View className="bg-white rounded-2xl items-center justify-center px-5 mr-2">
      <Ionicons name="folder-outline" size={20} color={colors.black} />
    </View>
  );
}

function renderRightActions() {
  return (
    <View className="items-center justify-center px-5 ml-2 rounded-2xl"
      style={{ backgroundColor: '#EF4444' }}
    >
      <Ionicons name="trash-outline" size={20} color={colors.white} />
    </View>
  );
}

import ChevronRight from '@/assets/svg/icons/chevron-right.svg';

export function InboxItem({ item, onDelete, onProcess }: InboxItemProps) {
  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') onProcess();
        if (direction === 'right') onDelete();
      }}
      overshootLeft={false}
      overshootRight={false}
    >
      <TouchableOpacity className="bg-black border border-white rounded-2xl px-4 py-3.5 flex-row items-center">
        <Text
          className="flex-1 text-white text-sm"
          numberOfLines={1}
        >
          {item.content}
        </Text>
        <ChevronRight width={16} height={16} color={colors.white} />
      </TouchableOpacity>
    </Swipeable>
  );
}
