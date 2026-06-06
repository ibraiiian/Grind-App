import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type EmptyStateType =
  | 'folders'
  | 'tasks'
  | 'tasks-filtered'
  | 'prompts'
  | 'prompts-filtered'
  | 'notes'
  | 'inbox'
  | 'search'
  | 'upcoming';

type EmptyStateProps = {
  type: EmptyStateType;
  customMessage?: string;
};

const CONFIG: Record<EmptyStateType, {
  icon: string;
  title: string;
  subtitle: string;
}> = {
  folders: {
    icon: 'folder-open-outline',
    title: 'belum ada folder.',
    subtitle: 'Buat folder pertamamu untuk mulai mengorganisir tugas dan catatan.',
  },
  tasks: {
    icon: 'checkmark-circle-outline',
    title: 'semua beres! ✦',
    subtitle: 'Tidak ada task yang perlu dikerjakan sekarang.',
  },
  'tasks-filtered': {
    icon: 'filter-outline',
    title: 'tidak ada hasil.',
    subtitle: 'Tidak ada task untuk filter yang dipilih.',
  },
  prompts: {
    icon: 'flash-outline',
    title: 'vault kosong.',
    subtitle: 'Simpan template AI prompt pertamamu dan pakai ulang kapan saja.',
  },
  'prompts-filtered': {
    icon: 'search-outline',
    title: 'tidak ditemukan.',
    subtitle: 'Coba kata kunci atau tag yang berbeda.',
  },
  notes: {
    icon: 'document-text-outline',
    title: 'belum ada catatan.',
    subtitle: 'Buat catatan pertama di folder ini.',
  },
  inbox: {
    icon: 'happy-outline',
    title: 'inbox zero. ☺',
    subtitle: 'Kamu lagi crushing it. Tidak ada yang perlu diproses.',
  },
  search: {
    icon: 'search-outline',
    title: 'tidak ditemukan.',
    subtitle: 'Coba kata kunci yang berbeda.',
  },
  upcoming: {
    icon: 'calendar-outline',
    title: 'tidak ada deadline.',
    subtitle: 'Semua task sudah selesai atau belum ada yang dijadwalkan.',
  },
};

export function EmptyState({ type, customMessage }: EmptyStateProps) {
  const config = CONFIG[type];

  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      {/* Icon */}
      <View className="mb-4 relative">
        <Ionicons name={config.icon as any} size={52} color="#222222" />
        {/* Ornamen bintang kecil di pojok kanan atas icon */}
        <Text
          className="absolute -top-1 -right-3 text-gray-700"
          style={{ fontSize: 10 }}
        >
          ✦
        </Text>
      </View>

      {/* Title */}
      <Text className="font-bold text-white text-lg text-center">
        {config.title}
      </Text>

      {/* Subtitle */}
      <Text className="text-sm text-gray-600 text-center mt-2 leading-5">
        {customMessage ?? config.subtitle}
      </Text>
    </View>
  );
}
