import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

import { useAllPrompts } from '@/hooks/usePrompts';
import { PromptCard } from '@/components/PromptCard';
import { AddPromptSheet, AddPromptSheetRef } from '@/components/AddPromptSheet';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';

// Doodles & Stickers — matching design reference
import BurstLines from '@/assets/svg/doodles/burst-lines.svg';
import Sparkle4Point from '@/assets/svg/doodles/sparkle-4point.svg';
import SparklesPair from '@/assets/svg/doodles/sparkles-pair.svg';
import LightningOutline from '@/assets/svg/doodles/lightning-outline.svg';
import DeadSmiley from '@/assets/svg/doodles/dead-smiley.svg';
import SquiggleArrow from '@/assets/svg/doodles/squiggle-arrow.svg';
import DotGrid from '@/assets/svg/ui-elements/dot-grid.svg';
import LetsGrind from '@/assets/svg/stickers/lets-grind.svg';
import LockedIn from '@/assets/svg/stickers/locked-in.svg';

export default function PromptsVaultScreen() {
  const router = useRouter();
  const { prompts, deletePrompt } = useAllPrompts();
  
  const addPromptSheetRef = useRef<AddPromptSheetRef>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('all');

  const allPrompts = prompts ?? [];
  
  // Extract all unique tags
  const allTags = ['all', ...new Set(allPrompts.flatMap((p: any) => p.tags || []))];

  // Filtering
  const filteredPrompts = allPrompts.filter((p: any) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesTag = activeTag === 'all' || (p.tags && p.tags.includes(activeTag));
    return matchesSearch && matchesTag;
  });

  const handleCopyRaw = async (template: string) => {
    await Clipboard.setStringAsync(template);
    Toast.show({ text1: 'Copied!', text2: 'Template disalin tanpa isi variabel', type: 'info' });
  };

  const handleLongPress = (id: any, title: string) => {
    Alert.alert(
      'Prompt Options',
      `Manage "${title}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit', onPress: () => Alert.alert('Coming soon', 'Edit prompt akan hadir di update berikutnya.') },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Hapus Prompt?',
              'Tindakan ini tidak bisa dibatalkan.',
              [
                { text: 'Batal', style: 'cancel' },
                { text: 'Hapus', style: 'destructive', onPress: () => deletePrompt({ id }) }
              ]
            );
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 px-5 pt-2">
        
        {/* ══════════════════════════════
            A. HEADER ROW
        ══════════════════════════════ */}
        <View className="flex-row items-start justify-between mb-5 relative">
          
          {/* Top-left burst lines doodle */}
          <View className="absolute -top-2 -left-3 opacity-90">
            <BurstLines width={28} height={28} color="#fff" />
          </View>

          {/* Left: Title + Subtitle */}
          <View className="flex-1 pl-3">
            <Text className="font-black text-[38px] text-white lowercase tracking-tight leading-tight">
              prompt vault.
            </Text>
            <Text className="text-sm text-gray-500 mt-0.5">
              {allPrompts.length} templates saved
            </Text>
          </View>

          {/* Center star doodle (absolute) */}
          <View className="absolute left-[55%] top-4 opacity-80">
            <Sparkle4Point width={20} height={20} color="#fff" />
          </View>

          {/* Right: Lightning bolt doodle */}
          <View className="mt-1 opacity-90">
            <LightningOutline width={32} height={32} color="#fff" />
          </View>
        </View>

        {/* ══════════════════════════════
            B. SEARCH BAR
        ══════════════════════════════ */}
        <View className="flex-row items-center mb-4 gap-3">
          <View className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex-row items-center">
            <Ionicons name="search-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 text-white text-base ml-3"
              placeholder="search prompts..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>

          {/* Dead smiley doodle next to search bar */}
          <View className="opacity-80">
            <DeadSmiley width={36} height={36} color="#fff" />
          </View>
        </View>

        {/* ══════════════════════════════
            C. TAG FILTER CHIPS
        ══════════════════════════════ */}
        <View className="mb-5">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {allTags.map(tag => {
              const isActive = activeTag === tag;
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => setActiveTag(tag)}
                  className={`rounded-full px-4 py-1.5 ${isActive ? 'bg-white' : 'border border-gray-700'}`}
                >
                  <Text className={`text-sm ${isActive ? 'text-black font-bold' : 'text-gray-400'}`}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ══════════════════════════════
            D. PROMPT LIST
        ══════════════════════════════ */}
        {prompts === undefined ? (
          <LoadingSkeleton rows={4} />
        ) : allPrompts.length === 0 ? (
          <EmptyState message="Belum ada prompt. Buat template AI pertamamu!" />
        ) : filteredPrompts.length === 0 ? (
          <EmptyState message="Tidak ada prompt untuk filter ini." />
        ) : (
          <FlatList
            data={filteredPrompts}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140 }}
            ItemSeparatorComponent={() => <View className="h-3" />}
            renderItem={({ item, index }) => (
              <View className="relative">
                {/* Decorative doodles on alternating cards */}
                {index % 3 === 0 && (
                  <View className="absolute right-[-4px] top-1/2 -translate-y-3 opacity-50 pointer-events-none z-10">
                    <BurstLines width={22} height={22} color="#fff" />
                  </View>
                )}
                {index % 3 === 1 && (
                  <View className="absolute right-[-6px] top-1/2 opacity-40 pointer-events-none z-10">
                    <SparklesPair width={24} height={24} color="#fff" />
                  </View>
                )}
                {index % 3 === 2 && (
                  <View className="absolute right-[-2px] bottom-2 opacity-40 pointer-events-none z-10">
                    <SquiggleArrow width={28} height={20} color="#fff" />
                  </View>
                )}
                <PromptCard
                  prompt={item as any}
                  onFillAndCopy={() => router.push(`/modals/prompt-fill?promptId=${item._id}`)}
                  onCopyRaw={() => handleCopyRaw(item.promptTemplate)}
                  onLongPress={() => handleLongPress(item._id, item.title)}
                />
              </View>
            )}
          />
        )}
      </View>

      {/* ══════════════════════════════
          BOTTOM DECORATIONS
      ══════════════════════════════ */}
      {/* Dot grid + Let's Grind sticker bottom-left */}
      <View className="absolute bottom-[76px] left-3 pointer-events-none opacity-60">
        <DotGrid width={48} height={36} color="#fff" />
      </View>
      <View className="absolute bottom-[76px] left-12 pointer-events-none">
        <LetsGrind width={80} height={28} />
      </View>

      {/* Locked-In sticker bottom-right corner */}
      <View className="absolute bottom-[76px] right-20 pointer-events-none" style={{ transform: [{ rotate: '6deg' }] }}>
        <LockedIn width={72} height={28} />
      </View>

      {/* ══════════════════════════════
          E. FAB BUTTON
      ══════════════════════════════ */}
      <View className="absolute bottom-6 right-6">
        <View className="absolute -top-4 -left-4 opacity-90" style={{ transform: [{ rotate: '-15deg' }] }}>
          <BurstLines width={32} height={32} color="#fff" />
        </View>
        <TouchableOpacity
          className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg"
          onPress={() => addPromptSheetRef.current?.present()}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <AddPromptSheet ref={addPromptSheetRef} />
    </SafeAreaView>
  );
}
