import { useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, SectionList, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';
import { toast } from '@/lib/toast';

import { useAllTasks } from '@/hooks/useTasks';
import { useFolders } from '@/hooks/useFolders';
import { useAppStore } from '@/store/appStore';
import { buildTaskSections, type TaskForGrouping } from '@/lib/deadline';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { SparkleOrnament, LockedInBadge, SparkleSmOrnament } from '@/components/DoodleOrnaments';
import { colors } from '@/constants/colors';

// SVGs
import Sparkle4Point from '@/assets/svg/doodles/sparkle-4point.svg';
import SparklesPair from '@/assets/svg/doodles/sparkles-pair.svg';
import BurstLines from '@/assets/svg/doodles/burst-lines.svg';
import SmileyDoodle from '@/assets/svg/doodles/smiley.svg';
import SquiggleArrow from '@/assets/svg/doodles/squiggle-arrow.svg';
import DotGrid from '@/assets/svg/ui-elements/dot-grid.svg';
import LockedInSticker from '@/assets/svg/stickers/locked-in.svg';
import UrgencyDotGray from '@/assets/svg/ui-elements/urgency-dot-gray.svg';

export default function GlobalTasksScreen() {
  const router = useRouter();
  const { tasks, updateStatus, deleteTask } = useAllTasks();
  const { folders } = useFolders();
  
  const { activeTaskFilter, setTaskFilter, selectedFolderFilter, setFolderFilter } = useAppStore();
  
  const folderSheetRef = useRef<BottomSheetModal>(null);

  const filters = ['all', 'urgent', 'today', 'this week', 'done'] as const;
  
  // Format filter values to match our logic
  const formatFilterValue = (f: string) => {
    if (f === 'this week') return 'thisWeek';
    return f;
  };

  // ─── Filter Logic ──────────────────────────────────────────
  const activeTasks = tasks ?? [];
  const totalCount = activeTasks.filter(t => t.status !== 'DONE').length;

  const displayedTasks = useMemo(() => {
    let filtered = activeTasks;
    if (selectedFolderFilter) {
      filtered = filtered.filter(t => t.folderId === selectedFolderFilter);
    }
    return filtered;
  }, [activeTasks, selectedFolderFilter]);

  const sections = useMemo(() => {
    const filterKey = formatFilterValue(activeTaskFilter);
    // Type casting because TaskCard expects full Task type but grouping only needs TaskForGrouping
    return buildTaskSections(displayedTasks as unknown as TaskForGrouping[], filterKey);
  }, [displayedTasks, activeTaskFilter]);

  // ─── Handlers ──────────────────────────────────────────────
  const handleSortPress = () => {
    toast.success('Sorted by deadline');
  };

  const handleToggleTask = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    updateStatus({ id: id as any, status: newStatus });
  };

  const handleDeleteTask = (id: string) => {
    deleteTask({ id: id as any });
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* ═══════════════════════════════════════════════
          A. HEADER ROW
          ═══════════════════════════════════════════════ */}
      <View className="px-5 pt-4 pb-4 flex-row items-center justify-between">
        <View className="relative">
          <View className="absolute -top-1 -left-5 opacity-80" style={{ transform: [{ rotate: '-15deg' }] }}>
            <BurstLines width={22} height={22} color="#fff" />
          </View>
          <Text className="font-black text-4xl text-white lowercase">all tasks.</Text>
          <View className="absolute top-0 -right-8">
            <SparklesPair width={24} height={24} color="#fff" />
          </View>
          <Text className="text-sm text-gray-500 mt-1">
            {totalCount} tasks · sorted by deadline
          </Text>
          <SparkleOrnament style={{ position: 'absolute', right: 52, top: 12 }} />
          <SparkleSmOrnament style={{ position: 'absolute', right: 44, top: 24 }} />
        </View>

        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center bg-transparent"
          onPress={handleSortPress}
        >
          <Ionicons name="options-outline" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* ═══════════════════════════════════════════════
          B. FILTER CHIPS
          ═══════════════════════════════════════════════ */}
      <View className="mb-4">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {filters.map((f) => {
            const isActive = activeTaskFilter === (f === 'this week' ? 'thisWeek' : f);
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setTaskFilter(formatFilterValue(f) as any)}
                className={`rounded-full px-4 py-2 ${
                  isActive ? 'bg-white' : 'border border-gray-500 bg-transparent'
                }`}
              >
                <Text className={`text-[15px] ${isActive ? 'text-black font-bold' : 'text-gray-400'}`}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ═══════════════════════════════════════════════
          C. FOLDER DROPDOWN
          ═══════════════════════════════════════════════ */}
      <View className="px-5 mb-5">
        <TouchableOpacity 
          className="border border-gray-600 rounded-xl h-11 px-4 flex-row items-center justify-between bg-transparent"
          onPress={() => folderSheetRef.current?.present()}
        >
          <Text className="text-white text-[15px] font-bold">
            {selectedFolderFilter 
              ? folders?.find(f => f._id === selectedFolderFilter)?.name || 'all folders'
              : 'all folders'}
          </Text>
          <Ionicons name="caret-down" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* ═══════════════════════════════════════════════
          D. TASK SECTIONS
          ═══════════════════════════════════════════════ */}
      <View className="flex-1 px-5">
        {tasks === undefined ? (
          <LoadingSkeleton variant="task-list" count={5} />
        ) : sections.length === 0 ? (
          tasks.length === 0 ? (
            <EmptyState type="tasks" />
          ) : (
            <EmptyState type="tasks-filtered" />
          )
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => (item as any)._id}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={8}
            windowSize={5}
            initialNumToRender={8}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderSectionHeader={({ section }) => (
              <View className="flex-row items-center mb-3 mt-4">
                {section.title === 'urgent' && (
                  <View className="flex-row items-center justify-between w-full pr-2">
                    <View className="flex-row items-center">
                      <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                      <Text className="text-[15px] font-bold text-red-500">urgent</Text>
                    </View>
                    <View className="flex-row items-center relative">
                      <View className="absolute right-8 top-1 opacity-80" style={{ transform: [{ rotate: '45deg' }] }}>
                        <BurstLines width={18} height={18} color="#fff" />
                      </View>
                      <SmileyDoodle width={24} height={24} color="#fff" />
                    </View>
                  </View>
                )}
                {section.title === 'this week' && (
                  <View className="flex-row items-center justify-between w-full pr-2">
                    <View className="flex-row items-center">
                      <Ionicons name="hourglass-outline" size={16} color={colors.gray500} className="mr-1.5" />
                      <Text className="text-[15px] text-gray-500 ml-1">this week</Text>
                    </View>
                    <View className="opacity-80">
                      <Sparkle4Point width={16} height={16} color="#fff" />
                    </View>
                  </View>
                )}
                {section.title === 'done' && (
                  <>
                    <Ionicons name="checkmark" size={16} color={colors.gray500} className="mr-1.5" />
                    <Text className="text-sm text-gray-500 ml-1.5">done</Text>
                  </>
                )}
              </View>
            )}
            renderItem={({ item }) => {
              const task = item as any;
              const folderName = folders?.find(f => f._id === task.folderId)?.name;
              return (
                <TaskCard
                  task={task}
                  folderName={folderName}
                  showFolderName={true}
                  onToggleDone={() => handleToggleTask(task._id, task.status)}
                  onDelete={() => handleDeleteTask(task._id)}
                />
              );
            }}
          />
        )}
      </View>

      {/* ═══════════════════════════════════════════════
          E. FAB BUTTON
          ═══════════════════════════════════════════════ */}
      <LockedInBadge style={{ position: 'absolute', bottom: 32, right: 84, zIndex: 50 }} />
      <View className="absolute bottom-6 left-0 right-0 flex-row items-end justify-between px-6 pointer-events-none">
        {/* Left doodles */}
        <View className="flex-row items-end pb-2">
          <SquiggleArrow width={48} height={48} color="#fff" />
        </View>
        
        {/* Right FAB Area */}
        <View className="items-center relative pointer-events-auto">
          <View className="absolute -left-20 bottom-2 pointer-events-none">
            <DotGrid width={36} height={36} color="#444" />
          </View>
          <View className="absolute -left-12 -top-2 z-10" style={{ transform: [{ rotate: '-10deg' }] }}>
            <LockedInSticker width={60} height={24} />
          </View>
          <View className="absolute -right-3 -bottom-1 z-0" style={{ transform: [{ rotate: '120deg' }] }}>
            <BurstLines width={20} height={20} color="#fff" />
          </View>

          <TouchableOpacity
            className="w-[60px] h-[60px] bg-white rounded-full items-center justify-center shadow-lg relative z-20"
            onPress={() => router.push('/modals/new-task')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={32} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ═══════════════════════════════════════════════
          FOLDER SELECTION BOTTOM SHEET
          ═══════════════════════════════════════════════ */}
      <BottomSheetModal
        ref={folderSheetRef}
        snapPoints={['50%']}
        index={0}
        backgroundStyle={{ backgroundColor: colors.gray900 }}
        handleIndicatorStyle={{ backgroundColor: colors.gray500 }}
        backdropComponent={renderBackdrop}
      >
        <View className="flex-1 px-5 pt-4">
          <Text className="text-white text-xl font-bold mb-4">Select Folder</Text>
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            <GHTouchableOpacity 
              className="flex-row items-center py-4 border-b border-gray-800"
              onPress={() => {
                setFolderFilter(null);
                folderSheetRef.current?.dismiss();
              }}
            >
              <View className="w-8" />
              <Text className={`text-base ${selectedFolderFilter === null ? 'text-white font-bold' : 'text-gray-400'}`}>
                all folders
              </Text>
            </GHTouchableOpacity>

            {folders?.map(f => (
              <GHTouchableOpacity 
                key={f._id}
                className="flex-row items-center py-4 border-b border-gray-800"
                onPress={() => {
                  setFolderFilter(f._id);
                  folderSheetRef.current?.dismiss();
                }}
              >
                <View className="w-8 items-center justify-center">
                   {/* We don't have the color dot component specifically, so fallback to urgency-dot or simple view */}
                   <View className="w-3 h-3 rounded-full" style={{ backgroundColor: (f as any).colorHex || '#888' }} />
                </View>
                <Text className={`text-base ${selectedFolderFilter === f._id ? 'text-white font-bold' : 'text-gray-400'}`}>
                  {f.name}
                </Text>
              </GHTouchableOpacity>
            ))}
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
