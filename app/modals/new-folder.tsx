import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { useFolders } from '@/hooks/useFolders';
import { useUser } from '@/lib/clerk';
import { FOLDER_ICON_KEYS, FOLDER_ICONS, FolderIconKey } from '@/constants/icons';
import { colors } from '@/constants/colors';

const PRESET_COLORS = ['#FFFFFF', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

export default function NewFolderModal() {
  const router = useRouter();
  const { user } = useUser();
  const { createFolder } = useFolders();
  
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [name, setName] = useState('');
  const [colorHex, setColorHex] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState<FolderIconKey>('crown');

  const userId = user?.id ?? '';

  // Handle Create
  const handleCreate = async () => {
    if (!name.trim() || !userId) return;
    
    await createFolder({
      userId,
      name: name.trim(),
      colorHex,
      icon,
    });
    
    router.back();
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
    <View className="flex-1 bg-black/50">
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['65%']}
        enablePanDownToClose
        onClose={() => router.back()}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.gray950 }}
        handleIndicatorStyle={{ backgroundColor: colors.gray500, width: 40 }}
      >
        <BottomSheetView className="flex-1 px-5 pt-2">
          <Text className="font-black text-2xl text-white mb-6">new folder.</Text>

          {/* A. FOLDER NAME INPUT */}
          <View className="mb-5">
            <Text className="text-xs text-gray-500 uppercase font-bold mb-2 tracking-wider">nama folder</Text>
            <TextInput
              className="bg-gray-900 border border-gray-700 rounded-xl h-14 px-4 text-white text-base font-bold"
              placeholder="Data Mining, Skripsi, PKM..."
              placeholderTextColor={colors.gray500}
              value={name}
              onChangeText={setName}
              autoFocus={true}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          {/* B. COLOR PICKER */}
          <View className="mb-5">
            <Text className="text-xs text-gray-500 uppercase font-bold mb-3 tracking-wider">warna label</Text>
            <View className="flex-row justify-between">
              {PRESET_COLORS.map((c) => {
                const isSelected = colorHex === c;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setColorHex(c)}
                    className="items-center justify-center"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: c,
                      borderWidth: isSelected ? 3 : 0,
                      borderColor: 'white',
                      transform: [{ scale: isSelected ? 1.1 : 1 }],
                    }}
                  />
                );
              })}
            </View>
          </View>

          {/* C. ICON PICKER */}
          <View className="mb-8">
            <Text className="text-xs text-gray-500 uppercase font-bold mb-3 tracking-wider">icon</Text>
            <View className="flex-row justify-between">
              {FOLDER_ICON_KEYS.map((i) => {
                const isSelected = icon === i;
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setIcon(i)}
                    className={`w-12 h-12 rounded-xl items-center justify-center ${
                      isSelected ? 'bg-white' : 'bg-gray-900 border border-gray-800'
                    }`}
                  >
                    <Ionicons 
                      name={FOLDER_ICONS[i]} 
                      size={24} 
                      color={isSelected ? 'black' : 'white'} 
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* D. CTA BUTTON */}
          <TouchableOpacity
            className={`bg-white rounded-xl h-14 items-center justify-center ${
              !name.trim() ? 'opacity-50' : 'opacity-100'
            }`}
            disabled={!name.trim()}
            onPress={handleCreate}
          >
            <Text className="text-black font-bold text-base">buat folder →</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
