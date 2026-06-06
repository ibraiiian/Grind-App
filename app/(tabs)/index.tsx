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

import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { toast } from '@/lib/toast';
import { SparkleOrnament, SparkleSmOrnament, DotsGridOrnament } from '@/components/DoodleOrnaments';
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
import { DottedBackground } from '@/components/ui/DottedBackground';

// SVGs
import Sparkle4Point from '@/assets/svg/doodles/sparkle-4point.svg';
import FocusModeSticker from '@/assets/svg/stickers/focus-mode.svg';
import AvatarIB from '@/assets/svg/ui-elements/avatar-ib.svg';
import DotGrid from '@/assets/svg/ui-elements/dot-grid.svg';
import ScribbleUnderline from '@/assets/svg/doodles/scribble-underline.svg';
import BurstLines from '@/assets/svg/doodles/burst-lines.svg';
import SendButton from '@/assets/svg/ui-elements/send-button.svg';
import LockedInSticker from '@/assets/svg/stickers/locked-in.svg';
import UrgencyDotGray from '@/assets/svg/ui-elements/urgency-dot-gray.svg';

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

      toast.success('Added to inbox!');
    } catch {
      toast.error('Gagal menambah item');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <DottedBackground />
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24 px-5 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════════════════════════════════════════════
            A. HEADER ROW
            ═══════════════════════════════════════════════ */}
        <View className="flex-row items-start justify-between mt-2 mb-8 relative">
          {/* Ornamen */}
          <SparkleOrnament style={{ position: 'absolute', top: 8, right: 80 }} />
          <SparkleSmOrnament style={{ position: 'absolute', top: 20, right: 72 }} />
          <DotsGridOrnament style={{ position: 'absolute', top: 4, right: 4 }} />

          {/* Top Right Dot Grid Pattern */}
          <View className="absolute right-[-10px] top-[40px] opacity-70 z-[-1]">
            <DotGrid width={80} height={80} color="#333" />
          </View>

          {/* Left: Greeting + Focus Mode */}
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-white font-bold text-base mr-1">good morning,</Text>
              <Sparkle4Point width={24} height={24} color="#fff" />
            </View>
            <Text className="text-white text-[32px] font-black mt-1 tracking-tight">
              {firstName} 👊
            </Text>

            {/* Focus Mode Pill */}
            <TouchableOpacity
              className="mt-3"
              onPress={toggleFocusMode}
              style={{ opacity: isFocusMode ? 1 : 0.5 }}
            >
              <FocusModeSticker width={95} height={28} />
            </TouchableOpacity>
          </View>

          {/* Right: Bell + Avatar */}
          <View className="flex-row items-center gap-x-4 pt-1">
            <TouchableOpacity className="relative">
              <Ionicons name="notifications" size={26} color={colors.white} />
              {/* small dot indicator */}
              <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-white rounded-full border border-black" />
            </TouchableOpacity>

            <TouchableOpacity>
              <AvatarIB width={44} height={44} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════
            B. QUICK CAPTURE BAR
            ═══════════════════════════════════════════════ */}
        <View className="border border-white bg-black rounded-2xl px-5 py-4 flex-row items-center mb-4 relative overflow-visible">
          {/* Decorative burst lines on top left of capture bar */}
          <View className="absolute -top-3 -left-3 opacity-80 z-10">
             <BurstLines width={30} height={30} color="#fff" />
          </View>

          <View className="flex-1 relative justify-center">
            <TextInput
              className="text-white text-lg font-bold italic mr-3 z-10 h-8 pt-1"
              placeholder="what's the grind today?"
              placeholderTextColor="#fff"
              value={captureText}
              onChangeText={setCaptureText}
              onSubmitEditing={handleCapture}
              returnKeyType="send"
              style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : undefined}
            />
            {/* The scribble underline should always be under the placeholder */}
            {!captureText && (
              <View className="absolute pointer-events-none z-0" style={{ left: 85, bottom: -12 }}>
                <ScribbleUnderline width={135} height={18} preserveAspectRatio="none" />
              </View>
            )}
          </View>
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center z-10"
            onPress={handleCapture}
          >
            <SendButton width={40} height={40} />
          </TouchableOpacity>
        </View>

        {/* ═══════════════════════════════════════════════
            C. UPCOMING DEADLINES SECTION
            ═══════════════════════════════════════════════ */}
        <SectionHeader title="UPCOMING DEADLINES" type="deadlines" />

        {upcomingTasks === undefined ? (
          <LoadingSkeleton count={3} />
        ) : upcomingTasks.length === 0 ? (
          <EmptyState type="upcoming" />
        ) : (
          <View className="gap-y-3">
            {upcomingTasks.map((task) => (
              <View
                key={task._id}
                className="bg-black border border-white rounded-2xl px-4 py-3 flex-row items-center"
              >
                {/* Status circle with optional burst */}
                <View className="mr-3 relative justify-center items-center w-6 h-6">
                  {task.isUrgent && (
                    <View className="absolute opacity-80">
                      <BurstLines width={24} height={24} color="#EF4444" />
                    </View>
                  )}
                  <UrgencyDotGray width={14} height={14} />
                </View>

                {/* Task info */}
                <View className="flex-1 mr-2">
                  <Text className="text-white font-bold text-[15px]">{task.title}</Text>
                  <Text className="text-gray-500 text-xs mt-0.5 font-medium">
                    {/* Folder placeholder */}
                    {task.isUrgent ? 'Data Mining' : (task.title.includes('Algoritma') ? 'Algoritma & Pemrograman' : 'PKM')}
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
              type="inbox"
            />

            {inboxItems === undefined ? (
              <LoadingSkeleton count={3} />
            ) : inboxItems.length === 0 ? (
              <EmptyState type="inbox" />
            ) : (
              <View className="gap-y-3 relative">
                {/* Decorative burst lines bottom left of inbox */}
                <View className="absolute -bottom-8 -left-3 opacity-80 z-10">
                   <BurstLines width={30} height={30} color="#fff" />
                </View>

                {inboxItems.map((item) => (
                  <InboxItem
                    key={item._id}
                    item={item}
                    onDelete={() => deleteItem({ id: item._id })}
                    onProcess={() => {
                      toast.comingSoon();
                    }}
                  />
                ))}
              </View>
            )}
          </>
        )}

        {/* Bottom decorative elements */}
        <View className="flex-row items-center mt-10 mb-4 ml-4">
          <LockedInSticker width={90} height={30} style={{ transform: [{ rotate: '-3deg' }] }} />
          <View className="flex-1" />
          {/* Dot grid ornament on the bottom right */}
          <View className="opacity-70 right-[-10px]">
            <DotGrid width={80} height={40} color="#333" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
