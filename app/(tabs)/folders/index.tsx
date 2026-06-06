import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useFolders } from '@/hooks/useFolders';
import { useTaskCounts } from '@/hooks/useTasks';
import { FolderCard } from '@/components/FolderCard';
import { BurstLines, DotGrid, SmileyDoodle } from '@/components/ui/Doodles';
import { SmileyOrnament, SparkleSmOrnament } from '@/components/DoodleOrnaments';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/constants/colors';
import { Id } from '@/convex/_generated/dataModel';

// SVGs
import SquiggleArrow from '@/assets/svg/doodles/squiggle-arrow.svg';
import DotGrid from '@/assets/svg/ui-elements/dot-grid.svg';
import BurstLines from '@/assets/svg/doodles/burst-lines.svg';

function FolderGridItem({ item, onLongPress }: { item: any; onLongPress: any }) {
  const router = useRouter();
  const { counts } = useTaskCounts(item._id);
  const totalTasks = counts ? counts.todo + counts.inProgress + counts.done : 0;
  
  return (
    <FolderCard
      folder={item}
      taskCount={totalTasks}
      noteCount={0}
      onPress={() => router.push(`/folders/${item._id}`)}
      onLongPress={() => onLongPress(item._id, item.name)}
    />
  );
}

export default function FolderGridScreen() {
  const router = useRouter();
  const { folders, archivedFolders, archiveFolder, deleteFolder } = useFolders();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const activeFolders = folders ?? [];
  const archived = archivedFolders ?? [];
  
  const displayFolders = showArchived ? archived : activeFolders;
  const filteredFolders = displayFolders.filter((f) => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLongPress = (folderId: Id<'folders'>, folderName: string) => {
    Alert.alert(
      'Folder Options',
      'Choose an action for this folder:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Rename', onPress: () => Alert.alert('Coming soon', 'Rename folder feature will be implemented in the next step.') },
        { 
          text: 'Archive', 
          onPress: () => archiveFolder({ id: folderId })
        },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Hapus folder ini?',
              'Semua task, catatan, dan prompt di dalamnya akan ikut terhapus.',
              [
                { text: 'Batal', style: 'cancel' },
                { text: 'Hapus', style: 'destructive', onPress: () => deleteFolder({ id: folderId }) },
              ]
            );
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 px-5 pt-4">
        {/* HEADER ROW */}
        <View className="flex-row items-start justify-between mb-6">
          <View className="flex-1 relative">
            <View className="flex-row items-end">
              <Text className="font-black text-[38px] text-white lowercase tracking-tight">my folders.</Text>
              <View className="ml-2 mb-2">
                <SmileyDoodle width={36} height={36} color="#fff" />
              </View>
            </View>
            <Text className="text-sm text-gray-500 mt-1">
              {activeFolders.length} active · {archived.length} archived
            </Text>
            <SmileyOrnament style={{ position: 'absolute', right: 56, top: 28 }} />
            <SparkleSmOrnament style={{ position: 'absolute', right: 48, top: 22 }} />
          </View>
          
          <TouchableOpacity 
            className="w-11 h-11 border border-gray-700 rounded-xl items-center justify-center mt-1"
            onPress={() => router.push('/modals/new-folder')}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex-row items-center mb-6">
          <Ionicons name="search" size={20} color={colors.gray500} />
          <TextInput
            className="flex-1 text-white text-base ml-3"
            placeholder="search folders..."
            placeholderTextColor={colors.gray500}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* FOLDER GRID */}
        {folders === undefined ? (
          <LoadingSkeleton rows={4} />
        ) : filteredFolders.length === 0 ? (
          <EmptyState type="folders" />
        ) : (
          <FlatList
            data={filteredFolders}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={{ gap: 12 }}
            contentContainerStyle={{ gap: 12, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
            initialNumToRender={8}
            getItemLayout={undefined}
            renderItem={({ item }) => (
              <FolderGridItem 
                item={item} 
                onLongPress={handleLongPress} 
              />
            )}
            ListFooterComponent={() => (
              archived.length > 0 && !searchQuery ? (
                <TouchableOpacity 
                  className="mt-6 mb-12"
                  onPress={() => setShowArchived(!showArchived)}
                >
                  <Text className="text-center text-gray-500 text-sm">
                    {showArchived ? 'Sembunyikan arsip' : `Lihat ${archived.length} arsip`}
                  </Text>
                </TouchableOpacity>
              ) : null
            )}
          />
        )}
      </View>

      {/* BOTTOM DECORATIONS */}
      <View className="absolute bottom-8 left-5 pointer-events-none opacity-80">
        <SquiggleArrow width={70} height={50} color="#fff" />
      </View>
      <View className="absolute bottom-8 left-1/2 -ml-[40px] pointer-events-none opacity-50">
        <DotGrid width={80} height={40} color="#fff" />
      </View>

      {/* FAB BUTTON */}
      <View className="absolute bottom-6 right-6">
        <View className="absolute -top-4 -left-4 opacity-90 rotate-[-15deg]">
          <BurstLines width={32} height={32} color="#fff" />
        </View>
        <TouchableOpacity
          className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg"
          onPress={() => router.push('/modals/new-folder')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
