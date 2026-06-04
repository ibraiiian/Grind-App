import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, usePathname, Slot, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFolderById, useFolders } from '@/hooks/useFolders';
import SparklesPair from '@/assets/svg/doodles/sparkles-pair.svg';
import BurstLines from '@/assets/svg/doodles/burst-lines.svg';
import { Id } from '@/convex/_generated/dataModel';

export default function FolderWorkspaceLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { folderId } = useLocalSearchParams<{ folderId: Id<'folders'> }>();
  
  const folder = useFolderById(folderId);
  const { archiveFolder, deleteFolder } = useFolders();

  // Determine active tab from pathname
  let activeTab = 'tasks';
  if (pathname.includes('/notes')) activeTab = 'notes';
  if (pathname.includes('/prompts')) activeTab = 'prompts';

  const handleMenuPress = () => {
    Alert.alert(
      'Folder Options',
      'Choose an action for this folder:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Rename', onPress: () => {} },
        { 
          text: 'Archive', 
          onPress: () => {
            archiveFolder({ id: folderId });
            router.replace('/(tabs)/folders');
          } 
        },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteFolder({ id: folderId });
            router.replace('/(tabs)/folders');
          } 
        },
      ]
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

        <View className="flex-row items-center relative">
          <View className="absolute -top-3 -left-5 opacity-80" style={{ transform: [{ rotate: '-15deg' }] }}>
            <BurstLines width={22} height={22} color="#fff" />
          </View>
          <Text className="font-black text-[22px] text-white mx-2">{folder.name}</Text>
          <View className="absolute -top-1 -right-7">
            <SparklesPair width={24} height={24} color="white" />
          </View>
        </View>

        <TouchableOpacity onPress={handleMenuPress} className="p-1 -mr-1">
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* TOP TAB BAR */}
      <View className="flex-row border-b border-gray-800 px-5 mb-4">
        {(['tasks', 'notes', 'prompts'] as const).map((tab, index) => {
          const isActive = activeTab === tab;
          return (
            <View key={tab} className="flex-1 flex-row items-center">
              <TouchableOpacity
                className="flex-1 items-center pb-3 pt-2 relative"
                onPress={() => navTo(tab)}
              >
                <Text className={`font-bold capitalize text-[15px] ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {tab}
                </Text>
                {isActive && (
                  <View className="absolute bottom-0 left-[20%] right-[20%] h-[3px] bg-white rounded-t-sm" />
                )}
              </TouchableOpacity>
              {index < 2 && <View className="w-[1px] h-5 bg-gray-600" />}
            </View>
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
