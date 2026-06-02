import { useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, SectionList, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

import { useAllTasks } from '@/hooks/useTasks';
import { useFolders } from '@/hooks/useFolders';
import { useAppStore } from '@/store/appStore';
import { buildTaskSections, type TaskForGrouping } from '@/lib/deadline';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { colors } from '@/constants/colors';

// SVGs
import Sparkle4Point from '@/assets/svg/doodles/sparkle-4point.svg';
import UrgencyDotGray from '@/assets/svg/ui-elements/urgency-dot-gray.svg';

export default function GlobalTasksScreen() {
  const router = useRouter();
  const { tasks, updateStatus } = useAllTasks();
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
    Toast.show({ text1: 'Sorted by deadline', type: 'success' });
  };

  const handleToggleTask = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    updateStatus({ id: id as any, status: newStatus });
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
          <View className="absolute -top-3 -right-6 opacity-80">
            <Sparkle4Point width={20} height={20} color="#fff" />
          </View>
          <Text className="font-black text-4xl text-white lowercase">all tasks.</Text>
          <Text className="text-sm text-gray-500 mt-1">
            {totalCount} tasks · sorted by deadline
          </Text>
        </View>

        <TouchableOpacity 
          className="w-10 h-10 border border-gray-700 rounded-xl items-center justify-center bg-gray-900"
          onPress={handleSortPress}
        >
          <Ionicons name="options-outline" size={22} color="white" />
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
                  isActive ? 'bg-white' : 'border border-gray-700 bg-black'
                }`}
              >
                <Text className={`text-sm font-bold ${isActive ? 'text-black' : 'text-gray-400'}`}>
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
          className="bg-gray-900 border border-gray-700 rounded-xl h-12 px-4 flex-row items-center justify-between"
          onPress={() => folderSheetRef.current?.present()}
        >
          <Text className="text-white text-base font-medium">
            {selectedFolderFilter 
              ? folders?.find(f => f._id === selectedFolderFilter)?.name || 'all folders'
              : 'all folders'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.gray500} />
        </TouchableOpacity>
      </View>

      {/* ═══════════════════════════════════════════════
          D. TASK SECTIONS
          ═══════════════════════════════════════════════ */}
      <View className="flex-1 px-5">
        {tasks === undefined ? (
          <LoadingSkeleton rows={5} />
        ) : sections.length === 0 ? (
          <EmptyState 
            message={activeTaskFilter === 'all' 
              ? "Belum ada task. Tambahkan dulu!" 
              : "Tidak ada task untuk filter ini."} 
          />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => (item as any)._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderSectionHeader={({ section }) => (
              <View className="flex-row items-center mb-3 mt-4">
                {section.title === 'urgent' && (
                  <>
                    <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                    <Text className="text-sm font-bold text-red-500">urgent</Text>
                  </>
                )}
                {section.title === 'this week' && (
                  <>
                    <Ionicons name="timer-outline" size={16} color={colors.gray400} className="mr-1.5" />
                    <Text className="text-sm text-gray-400 ml-1.5">this week</Text>
                    <View className="ml-2 mt-0.5 opacity-60">
                      <Sparkle4Point width={14} height={14} color={colors.gray400} />
                    </View>
                  </>
                )}
                {section.title === 'done' && (
                  <>
                    <Ionicons name="checkmark" size={16} color={colors.gray600} className="mr-1.5" />
                    <Text className="text-sm text-gray-600 ml-1.5">done</Text>
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
                />
              );
            }}
          />
        )}
      </View>

      {/* ═══════════════════════════════════════════════
          E. FAB BUTTON
          ═══════════════════════════════════════════════ */}
      <View className="absolute bottom-6 right-6 items-center">
        <View className="mb-2 border border-gray-700 bg-gray-900 rounded-full px-2 py-0.5">
          <Text className="text-white font-bold text-[9px] uppercase tracking-wider">locked in</Text>
        </View>
        <TouchableOpacity
          className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg"
          onPress={() => router.push('/modals/new-task')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* ═══════════════════════════════════════════════
          FOLDER SELECTION BOTTOM SHEET
          ═══════════════════════════════════════════════ */}
      <BottomSheetModal
        ref={folderSheetRef}
        snapPoints={['50%']}
        index={0}
        backgroundStyle={{ backgroundColor: colors.gray900 }}
        handleIndicatorStyle={{ backgroundColor: colors.gray600 }}
        backdropComponent={renderBackdrop}
      >
        <View className="flex-1 px-5 pt-4">
          <Text className="text-white text-xl font-bold mb-4">Select Folder</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity 
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
            </TouchableOpacity>

            {folders?.map(f => (
              <TouchableOpacity 
                key={f._id}
                className="flex-row items-center py-4 border-b border-gray-800"
                onPress={() => {
                  setFolderFilter(f._id);
                  folderSheetRef.current?.dismiss();
                }}
              >
                <View className="w-8 items-center justify-center">
                   {/* We don't have the color dot component specifically, so fallback to urgency-dot or simple view */}
                   <View className="w-3 h-3 rounded-full" style={{ backgroundColor: f.color || '#888' }} />
                </View>
                <Text className={`text-base ${selectedFolderFilter === f._id ? 'text-white font-bold' : 'text-gray-400'}`}>
                  {f.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
