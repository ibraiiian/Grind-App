import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Id } from '@/convex/_generated/dataModel';

import { useTasks, useTaskCounts } from '@/hooks/useTasks';
import { TaskCard } from '@/components/TaskCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';

// Doodles
import SmileyDoodle from '@/assets/svg/doodles/smiley.svg';
import Sparkle4Point from '@/assets/svg/doodles/sparkle-4point.svg';
import SquiggleArrow from '@/assets/svg/doodles/squiggle-arrow.svg';
import LockedInSticker from '@/assets/svg/stickers/locked-in.svg';
import DotGrid from '@/assets/svg/ui-elements/dot-grid.svg';

type FilterStatus = 'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE';

export default function FolderTasksScreen() {
  const { folderId } = useLocalSearchParams<{ folderId: Id<'folders'> }>();
  const router = useRouter();

  const { tasks, updateStatus } = useTasks(folderId);
  const { counts } = useTaskCounts(folderId);
  
  const [filter, setFilter] = useState<FilterStatus>('ALL');

  const filteredTasks = tasks?.filter(t => filter === 'ALL' || t.status === filter) || [];

  return (
    <View className="flex-1 px-5 pt-2 relative">
      {/* Decorative Doodles */}
      <View className="absolute top-1 left-2">
        <SmileyDoodle width={32} height={32} color="#fff" />
      </View>
      <View className="absolute top-12 right-0">
        <Sparkle4Point width={24} height={24} color="#fff" />
      </View>

      {/* STATUS COUNTER PILLS */}
      <View className="flex-row items-center justify-center gap-x-3 mb-6 relative z-10">
        <TouchableOpacity 
          className={`flex-row items-center border rounded-full px-4 py-2 ${filter === 'TODO' ? 'border-white bg-white/10' : 'border-gray-700'}`}
          onPress={() => setFilter(filter === 'TODO' ? 'ALL' : 'TODO')}
        >
          <Text className="font-bold text-white mr-1">{counts?.todo || 0}</Text>
          <Text className="text-gray-500 text-sm">todo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className={`flex-row items-center border rounded-full px-4 py-2 ${filter === 'IN_PROGRESS' ? 'border-white bg-white/10' : 'border-gray-700'}`}
          onPress={() => setFilter(filter === 'IN_PROGRESS' ? 'ALL' : 'IN_PROGRESS')}
        >
          <Text className="font-bold text-white mr-1">{counts?.inProgress || 0}</Text>
          <Text className="text-gray-500 text-sm">in progress</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className={`flex-row items-center border rounded-full px-4 py-2 ${filter === 'DONE' ? 'border-white bg-white/10' : 'border-gray-700'}`}
          onPress={() => setFilter(filter === 'DONE' ? 'ALL' : 'DONE')}
        >
          <Text className="font-bold text-white mr-1">{counts?.done || 0}</Text>
          <Text className="text-gray-500 text-sm">done</Text>
        </TouchableOpacity>
      </View>

      {/* TASK LIST */}
      {tasks === undefined ? (
        <LoadingSkeleton rows={4} />
      ) : tasks.length === 0 ? (
        <EmptyState message="Belum ada task di folder ini." />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggleDone={() => {
                const newStatus = item.status === 'DONE' ? 'TODO' : 'DONE';
                updateStatus({ id: item._id, status: newStatus });
              }}
            />
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
                className="h-14 border border-gray-700 rounded-xl items-center justify-center flex-row relative"
                style={{ borderStyle: 'dashed' }}
                onPress={() => {
                  // Navigate to modal
                  router.push(`/modals/new-task?folderId=${folderId}`);
                }}
              >
                <Text className="text-white text-base font-medium">+ add task</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
