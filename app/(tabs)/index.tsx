/**
 * GRIND App — Home Screen
 * Source: PRD v2.0 Section 3.1 (FR-1.1 to FR-1.6)
 *
 * Layout (top to bottom):
 * A. Header Row — greeting, focus mode, bell, avatar
 * B. Quick Capture Bar — text input + submit
 * C. Upcoming Deadlines — top 3 tasks
 * D. Inbox Section — hidden in focus mode
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { useUser } from '@/lib/clerk';
import { useInbox } from '@/hooks/useInbox';
import { useUpcomingTasks } from '@/hooks/useTasks';
import { useAppStore } from '@/store/appStore';
import { getTimeGreeting, getInitials } from '@/lib/utils';
import { colors } from '@/constants/colors';

import { SectionHeader } from '@/components/SectionHeader';
import { DeadlineBadge } from '@/components/DeadlineBadge';
import { InboxItem } from '@/components/InboxItem';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';

export default function HomeScreen() {
  const { user } = useUser();
  const { items: inboxItems, createItem, deleteItem, userId } = useInbox();
  const { tasks: upcomingTasks } = useUpcomingTasks();
  const { isFocusMode, toggleFocusMode } = useAppStore();

  const [captureText, setCaptureText] = useState('');

  const firstName = user?.firstName || 'User';
  const fullName = user?.fullName || 'User';
  const initials = getInitials(fullName);
  const greeting = getTimeGreeting();

  // ─── Quick Capture Submit ────────────────────────────
  const handleCapture = async () => {
    if (!captureText.trim()) return;

    try {
      await createItem({ userId, content: captureText.trim() });
      setCaptureText('');

      // Haptic feedback (if available)
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Haptics not available on web
      }

      Toast.show({ text1: 'Added to inbox!', type: 'success' });
    } catch {
      Toast.show({ text1: 'Gagal menambah item', type: 'error' });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24 px-5"
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════════════════════════════════════════════
            A. HEADER ROW
            ═══════════════════════════════════════════════ */}
        <View className="flex-row items-start justify-between mt-2 mb-4">
          {/* Left: Greeting + Focus Mode */}
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-gray-500 text-sm">{greeting},</Text>
              <Text className="text-gray-500 ml-2 text-base">✦</Text>
              <Text className="text-gray-500 ml-1 text-xs">✦</Text>
            </View>
            <Text className="text-white text-2xl font-black mt-0.5">
              {firstName} 👊
            </Text>

            {/* Focus Mode Pill */}
            <TouchableOpacity
              className="flex-row items-center border border-gray-700 rounded-full px-3 py-1.5 mt-2 self-start"
              style={{ backgroundColor: isFocusMode ? colors.gray900 : 'transparent' }}
              onPress={toggleFocusMode}
            >
              <Text className="text-gray-500 text-xs mr-1">⊕</Text>
              <Text className="text-gray-500 text-xs font-medium">focus mode</Text>
            </TouchableOpacity>
          </View>

          {/* Right: Bell + Avatar */}
          <View className="flex-row items-center gap-x-3">
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color={colors.white} />
            </TouchableOpacity>

            <View
              className="w-10 h-10 rounded-full bg-white items-center justify-center"
            >
              <Text className="text-black font-black text-sm">{initials}</Text>
            </View>
          </View>
        </View>

        {/* Dot grid ornament */}
        <View className="flex-row justify-end mb-2 opacity-30">
          {Array.from({ length: 5 }).map((_, row) => (
            <View key={row} className="flex-col mx-0.5">
              {Array.from({ length: 5 }).map((_, col) => (
                <View
                  key={col}
                  className="rounded-full bg-gray-500 mb-0.5"
                  style={{ width: 2, height: 2 }}
                />
              ))}
            </View>
          ))}
        </View>

        {/* ═══════════════════════════════════════════════
            B. QUICK CAPTURE BAR
            ═══════════════════════════════════════════════ */}
        <View className="bg-gray-900 rounded-2xl px-4 py-4 flex-row items-center mb-2">
          <TextInput
            className="flex-1 text-white text-base mr-3"
            placeholder="what's the grind today?"
            placeholderTextColor={colors.gray500}
            value={captureText}
            onChangeText={setCaptureText}
            onSubmitEditing={handleCapture}
            returnKeyType="send"
            style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : undefined}
          />
          <TouchableOpacity
            className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-900 items-center justify-center"
            onPress={handleCapture}
          >
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* ═══════════════════════════════════════════════
            C. UPCOMING DEADLINES SECTION
            ═══════════════════════════════════════════════ */}
        <SectionHeader title="UPCOMING DEADLINES" ornament="✦" />

        {upcomingTasks === undefined ? (
          <LoadingSkeleton rows={3} />
        ) : upcomingTasks.length === 0 ? (
          <EmptyState message="no upcoming deadlines ✦" />
        ) : (
          <View className="gap-y-2">
            {upcomingTasks.map((task) => (
              <View
                key={task._id}
                className="bg-gray-950 border border-gray-700 rounded-xl px-4 py-3.5 flex-row items-center"
              >
                {/* Status circle */}
                <View className="w-5 h-5 rounded-full border-2 border-gray-500 mr-3" />

                {/* Task info */}
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm">{task.title}</Text>
                  <Text className="text-gray-500 text-xs mt-0.5">
                    {/* Folder name would need a lookup — show placeholder */}
                    Task
                  </Text>
                </View>

                {/* Deadline badge */}
                <DeadlineBadge
                  deadline={task.deadline}
                  status={task.status}
                  isUrgent={task.isUrgent}
                />
              </View>
            ))}
          </View>
        )}

        {/* ═══════════════════════════════════════════════
            D. INBOX SECTION (hidden in focus mode)
            ═══════════════════════════════════════════════ */}
        {!isFocusMode && (
          <>
            <SectionHeader
              title="INBOX"
              count={inboxItems?.length}
              ornament="☺"
            />

            {inboxItems === undefined ? (
              <LoadingSkeleton rows={3} />
            ) : inboxItems.length === 0 ? (
              <EmptyState message="inbox zero. you're crushing it ✦" />
            ) : (
              <View className="gap-y-2">
                {inboxItems.map((item) => (
                  <InboxItem
                    key={item._id}
                    item={item}
                    onDelete={() => deleteItem({ id: item._id })}
                    onProcess={() => {
                      // TODO: Open bottom sheet to pick folder
                      Toast.show({
                        text1: 'Coming soon',
                        text2: 'Folder selection akan tersedia di prompt berikutnya',
                        type: 'info',
                      });
                    }}
                  />
                ))}
              </View>
            )}
          </>
        )}

        {/* Bottom decorative elements */}
        <View className="flex-row items-center mt-6 mb-4">
          <View className="flex-row items-center border border-gray-700 rounded-full px-2.5 py-1 mr-2">
            <Ionicons name="lock-closed" size={10} color={colors.gray500} />
            <Text className="text-gray-500 text-[10px] font-medium ml-1">locked in</Text>
          </View>
          <View className="flex-1" />
          {/* Dot grid ornament */}
          <View className="flex-row opacity-30">
            {Array.from({ length: 6 }).map((_, row) => (
              <View key={row} className="flex-col mx-0.5">
                {Array.from({ length: 3 }).map((_, col) => (
                  <View
                    key={col}
                    className="rounded-full bg-gray-500 mb-0.5"
                    style={{ width: 2, height: 2 }}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
