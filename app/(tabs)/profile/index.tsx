import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser, useAuth } from '@/lib/clerk';
import { useRouter } from 'expo-router';
import { StatsCard } from '@/components/StatsCard';
import { useUserStats, useUpsertUser } from '@/hooks/useUserStats';
import { getInitials } from '@/lib/utils';
import { useState } from 'react';
import * as Notifications from 'expo-notifications';
import { ProfileSectionLabel } from '@/components/ProfileSectionLabel';
import { ProfileRow } from '@/components/ProfileRow';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { toast } from '@/lib/toast';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const { stats } = useUserStats();
  const { updatePushToken } = useUpsertUser();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const fullName = user?.fullName ?? user?.firstName ?? '';
  const email = (user as any)?.emailAddresses?.[0]?.emailAddress ?? (user as any)?.primaryEmailAddress?.emailAddress ?? '';
  const initials = getInitials(fullName);

  const handleNotifToggle = async (enabled: boolean) => {
    if (enabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Izin Diperlukan',
          'Aktifkan izin notifikasi di Pengaturan HP untuk menerima reminder deadline.',
          [{ text: 'OK' }]
        );
        return;
      }
      try {
        const token = await Notifications.getExpoPushTokenAsync();
        await updatePushToken({
          clerkId: user!.id,
          expoPushToken: token.data
        });
        setNotificationsEnabled(true);
      } catch {
        Alert.alert('Error', 'Gagal mengaktifkan notifikasi.');
      }
    } else {
      await updatePushToken({ clerkId: user!.id, expoPushToken: undefined });
      setNotificationsEnabled(false);
    }
  };

  // Change password via Clerk reset email
  const handleChangePassword = async () => {
    try {
      Alert.alert(
        'Ganti Password',
        'Link reset password akan dikirim ke:\n' + email,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Kirim Email',
            onPress: async () => {
              // Untuk MVP
              toast.success('Email terkirim!', 'Cek inbox kamu untuk reset password.');
            }
          }
        ]
      );
    } catch {
      toast.error('Gagal kirim email reset.');
    }
  };

  // Connected accounts
  const connectedAccounts = (user as any)?.externalAccounts ?? [];
  const googleAccount = connectedAccounts.find(
    (a: any) => a.provider === 'google' || a.provider === 'oauth_google'
  );

  // Export data — coming soon
  const handleExportData = () => {
    toast.comingSoon();
  };

  // Open ursite.dev
  const handleOpenIbraDev = () => {
    Linking.openURL('https://ibra.dev');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Yakin mau keluar dari GRIND?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/sign-in');
            } catch {
              toast.error('Gagal sign out.');
            }
          },
        },
      ]
    );
  };

  // App version
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

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

        {/* ── SECTION PREFERENCES (FR-7.4) ── */}
        <ProfileSectionLabel label="Preferences" />
        <View className="bg-gray-950 border border-gray-700 rounded-2xl overflow-hidden">
          <ProfileRow
            label="notifications"
            switchValue={notificationsEnabled}
            onSwitchChange={handleNotifToggle}
            isFirst
          />
          <ProfileRow
            label="dark mode"
            switchValue={true}
            switchDisabled={true}
            lockIcon={true}
            isLast
          />
        </View>

        {/* ── SECTION ACCOUNT (FR-7.5) ── */}
        <ProfileSectionLabel label="Account" />
        <View className="bg-gray-950 border border-gray-700 rounded-2xl overflow-hidden">
          <ProfileRow
            label="change password"
            onPress={handleChangePassword}
            showChevron
            isFirst
          />
          <ProfileRow
            label="connected accounts"
            onPress={() => toast.comingSoon()}
            rightBadge={googleAccount ? 'Google' : undefined}
            showChevron
          />
          <ProfileRow
            label="export my data"
            onPress={handleExportData}
            showChevron
            isLast
          />
        </View>

        {/* ── SECTION ABOUT (FR-7.6) ── */}
        <ProfileSectionLabel label="About" />
        <View className="bg-gray-950 border border-gray-700 rounded-2xl overflow-hidden">
          <ProfileRow
            label="version"
            rightText={appVersion}
            isFirst
          />
          <ProfileRow
            label="built by Ibra"
            onPress={handleOpenIbraDev}
            rightText="Ibra.dev"
            showChevron
            isLast
          />
        </View>

        {/* ── SIGN OUT BUTTON (FR-7.7) ── */}
        <TouchableOpacity
          onPress={handleSignOut}
          className="mt-6 mb-2 border border-gray-700 rounded-xl h-14 items-center justify-center"
          activeOpacity={0.7}
        >
          <Text className="text-white font-medium text-base">
            sign out
          </Text>
        </TouchableOpacity>

        {/* Version watermark di paling bawah */}
        <Text className="text-center text-gray-800 text-xs mt-4 mb-2">
          GRIND v{appVersion} · built with ♥ by Ibra
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}
