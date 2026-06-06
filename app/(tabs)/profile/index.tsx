import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@/lib/clerk';
import { StatsCard } from '@/components/StatsCard';
import { useUserStats } from '@/hooks/useUserStats';
import { getInitials } from '@/lib/utils';

export default function ProfileScreen() {
  const { user } = useUser();
  const { stats } = useUserStats();

  const fullName = user?.fullName ?? user?.firstName ?? '';
  const email = user?.emailAddresses?.[0]?.emailAddress ?? '';
  const initials = getInitials(fullName);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER (FR-7.1) ── */}
        <Text className="font-black text-4xl text-white mt-6 mb-6">
          profile.
        </Text>

        {/* ── USER CARD (FR-7.2) ── */}
        <View className="bg-gray-950 border border-gray-700 rounded-2xl p-4">
          <View className="flex-row items-center">
            {/* Avatar */}
            <View className="w-16 h-16 rounded-full bg-white items-center justify-center">
              <Text className="font-black text-2xl text-black">
                {initials}
              </Text>
            </View>
            {/* Info */}
            <View className="flex-1 ml-4">
              <Text className="font-bold text-white text-lg" numberOfLines={1}>
                {fullName || 'Pengguna GRIND'}
              </Text>
              <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
                {email}
              </Text>
              {/* Plan badge */}
              <View className="mt-2 self-start border border-gray-600 rounded-full px-3 py-1">
                <Text className="text-xs text-gray-400">free plan</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── STATS ROW (FR-7.3) ── */}
        <View className="flex-row gap-3 mt-4">
          <StatsCard value={stats?.taskCount} label="tasks" />
          <StatsCard value={stats?.folderCount} label="folders" />
          <StatsCard value={stats?.promptCount} label="prompts" />
        </View>

        {/* placeholder untuk section berikutnya */}
        <View className="mt-6 h-px bg-gray-900" />
        <Text className="text-gray-800 text-xs text-center mt-4">
          preferences + account + about — coming in 9C & 9D
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}
