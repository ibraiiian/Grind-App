import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Id } from '@/convex/_generated/dataModel';

import { useTasks, useTaskCounts } from '@/hooks/useTasks';
import { TaskCard } from '@/components/TaskCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';

import SmileyDoodle from '@/assets/svg/doodles/smiley.svg';
import Sparkle4Point from '@/assets/svg/doodles/sparkle-4point.svg';
import BurstLines from '@/assets/svg/doodles/burst-lines.svg';
import SquiggleArrow from '@/assets/svg/doodles/squiggle-arrow.svg';
import LockedInSticker from '@/assets/svg/stickers/locked-in.svg';
import DotGrid from '@/assets/svg/ui-elements/dot-grid.svg';

type FilterStatus = 'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE';

export default function FolderTasksScreen() {
  const { folderId } = useLocalSearchParams<{ folderId: Id<'folders'> }>();
  const router = useRouter();

  const { tasks, updateStatus, deleteTask } = useTasks(folderId);
  const { counts } = useTaskCounts(folderId);
  
  const [filter, setFilter] = useState<FilterStatus>('ALL');

  const filteredTasks = tasks?.filter(t => filter === 'ALL' || t.status === filter) || [];

  return (
    <View className="flex-1 px-5 pt-2 relative">
      {/* STATUS COUNTER PILLS */}
      <View className="flex-row items-center justify-center gap-x-2 mb-6 relative z-10 mt-2">
        {/* Decorative Doodles */}
        <View className="absolute -left-3 top-1">
          <SmileyDoodle width={24} height={24} color="#fff" />
        </View>
        <View className="absolute -right-3 -top-2" style={{ transform: [{ rotate: '45deg' }] }}>
          <BurstLines width={22} height={22} color="#fff" />
        </View>
        <View className="absolute -right-4 top-4">
          <Sparkle4Point width={14} height={14} color="#fff" />
        </View>
        <TouchableOpacity 
          className={`flex-row items-center border rounded-full px-4 py-[6px] ${filter === 'TODO' ? 'border-white' : 'border-white/40'}`}
          onPress={() => setFilter(filter === 'TODO' ? 'ALL' : 'TODO')}
        >
          <Text className="font-bold text-white mr-1.5 text-[15px]">{counts?.todo || 0}</Text>
          <Text className="text-gray-400 text-xs">todo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className={`flex-row items-center border rounded-full px-4 py-[6px] ${filter === 'IN_PROGRESS' ? 'border-white' : 'border-white/40'}`}
          onPress={() => setFilter(filter === 'IN_PROGRESS' ? 'ALL' : 'IN_PROGRESS')}
        >
          <Text className="font-bold text-white mr-1.5 text-[15px]">{counts?.inProgress || 0}</Text>
          <Text className="text-gray-400 text-xs">in progress</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className={`flex-row items-center border rounded-full px-4 py-[6px] ${filter === 'DONE' ? 'border-white' : 'border-white/40'}`}
          onPress={() => setFilter(filter === 'DONE' ? 'ALL' : 'DONE')}
        >
          <Text className="font-bold text-white mr-1.5 text-[15px]">{counts?.done || 0}</Text>
          <Text className="text-gray-400 text-xs">done</Text>
        </TouchableOpacity>
      </View>

      {/* TASK LIST */}
      {tasks === undefined ? (
        <LoadingSkeleton rows={4} />
      ) : tasks.length === 0 ? (
        <EmptyState type="tasks" />
      ) : filteredTasks.length === 0 ? (
        <EmptyState type="tasks-filtered" />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => (
            <View className="relative">
              {/* Doodles for specific indices to match design */}
              {index === 0 && filter === 'ALL' && (
                <View className="absolute -left-4 top-8 z-0" style={{ transform: [{ rotate: '-25deg' }] }}>
                  <BurstLines width={18} height={18} color="#fff" />
                </View>
              )}
              {index === 2 && filter === 'ALL' && (
                <View className="absolute -right-4 top-10 z-0">
                  <Sparkle4Point width={18} height={18} color="#fff" />
                </View>
              )}

              <TaskCard
                task={item}
                onToggleDone={() => {
                  const newStatus = item.status === 'DONE' ? 'TODO' : 'DONE';
                  updateStatus({ id: item._id, status: newStatus });
                }}
                onDelete={() => deleteTask({ id: item._id })}
              />
            </View>
          )}
          ListFooterComponent={() => (
            <View className="mt-8 relative mb-8">
              {/* Bottom Doodles */}
              <View className="absolute -top-12 left-0 -ml-2 pointer-events-none z-10 opacity-80">
                <SquiggleArrow width={70} height={50} color="#fff" />
              </View>
              <View className="absolute -top-4 right-20 pointer-events-none z-10 opacity-50">
                <DotGrid width={60} height={30} color="#fff" />
              </View>
              <View className="absolute -top-2 right-2 pointer-events-none z-20" style={{ transform: [{ rotate: '5deg' }] }}>
                <LockedInSticker width={80} height={26} />
              </View>
              
              <TouchableOpacity
                className="h-[52px] border border-gray-500 rounded-[16px] items-center justify-center flex-row relative mt-2 bg-transparent"
                style={{ borderStyle: 'dashed' }}
                onPress={() => {
                  // Navigate to modal
                  router.push(`/modals/new-task?folderId=${folderId}`);
                }}
              >
                <Text className="text-white text-[15px] font-bold">+ add task</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
