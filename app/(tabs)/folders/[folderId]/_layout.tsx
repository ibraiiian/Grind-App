import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, usePathname, Slot, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useFolderById, useFolders } from '@/hooks/useFolders';
import Sparkle4Point from '@/assets/svg/doodles/sparkle-4point.svg';
import { Id } from '@/convex/_generated/dataModel';

export default function FolderWorkspaceLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { folderId } = useLocalSearchParams<{ folderId: Id<'folders'> }>();
  const { showActionSheetWithOptions } = useActionSheet();
  
  const folder = useFolderById(folderId);
  const { archiveFolder, deleteFolder } = useFolders();

  // Determine active tab from pathname
  let activeTab = 'tasks';
  if (pathname.includes('/notes')) activeTab = 'notes';
  if (pathname.includes('/prompts')) activeTab = 'prompts';

  const handleMenuPress = () => {
    const options = ['Rename', 'Archive', 'Delete', 'Cancel'];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        if (selectedIndex === 0) {
          // rename
        } else if (selectedIndex === 1) {
          archiveFolder({ id: folderId });
          router.replace('/(tabs)/folders');
        } else if (selectedIndex === 2) {
          deleteFolder({ id: folderId });
          router.replace('/(tabs)/folders');
        }
      }
    );
  };

  const navTo = (tab: string) => {
    // using replace so it doesn't push multiple stack screens
    router.replace(`/folders/${folderId}/${tab}`);
  };

  if (!folder) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <Text className="text-white font-bold">Loading folder...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity onPress={() => router.replace('/(tabs)/folders')} className="p-1 -ml-1">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <Text className="font-bold text-xl text-white mr-1">{folder.name}</Text>
          <Sparkle4Point width={18} height={18} color="white" />
        </View>

        <TouchableOpacity onPress={handleMenuPress} className="p-1 -mr-1">
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* TOP TAB BAR */}
      <View className="flex-row border-b border-gray-800 px-5 mb-4">
        {(['tasks', 'notes', 'prompts'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              className="flex-1 items-center pb-3 pt-2 relative"
              onPress={() => navTo(tab)}
            >
              <Text className={`font-bold capitalize ${isActive ? 'text-white' : 'text-gray-500'}`}>
                {tab}
              </Text>
              {isActive && (
                <View className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CONTENT (Nested Route will render here) */}
      <View className="flex-1">
        <Slot />
      </View>
    </SafeAreaView>
  );
}
