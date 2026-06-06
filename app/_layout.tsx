import { ClerkProvider, useAuth, AppConvexProvider, useUser } from "@/lib/clerk";
import { ConvexReactClient, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast, { ToastConfig } from "react-native-toast-message";
import { Ionicons } from '@expo/vector-icons';
// @ts-ignore
import "../global.css";
import { colors } from "@/constants/colors";

const EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const EXPO_PUBLIC_CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(EXPO_PUBLIC_CONVEX_URL, {
  unsavedChangesWarning: false,
});

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Custom toast config — dark theme sesuai design GRIND
const toastConfig: ToastConfig = {
  success: ({ text1, text2 }: any) => (
    <View
      style={{
        marginHorizontal: 16,
        backgroundColor: '#111111',
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}>
          {text1}
        </Text>
        {text2 ? (
          <Text style={{ color: '#888888', fontSize: 11, marginTop: 1 }}>
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  ),

  error: ({ text1, text2 }: any) => (
    <View
      style={{
        marginHorizontal: 16,
        backgroundColor: '#111111',
        borderWidth: 1,
        borderColor: '#2D0A0A',
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      <Ionicons name="alert-circle" size={16} color="#EF4444" />
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}>
          {text1}
        </Text>
        {text2 ? (
          <Text style={{ color: '#888888', fontSize: 11, marginTop: 1 }}>
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  ),

  info: ({ text1, text2 }: any) => (
    <View
      style={{
        marginHorizontal: 16,
        backgroundColor: '#111111',
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      <Ionicons name="information-circle" size={16} color="#888888" />
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}>
          {text1}
        </Text>
        {text2 ? (
          <Text style={{ color: '#888888', fontSize: 11, marginTop: 1 }}>
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  ),
};

function AuthGuard() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const upsertUser = useMutation(api.users.upsertUser);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/splash");
    }
  }, [isSignedIn, isLoaded, segments]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const syncUser = async () => {
      try {
        await upsertUser({
          clerkId: user.id,
          email: (user as any)?.emailAddresses?.[0]?.emailAddress ?? (user as any)?.primaryEmailAddress?.emailAddress ?? '',
          name: user.fullName ?? undefined,
        });
      } catch (err) {
        // Gagal sync tidak fatal — log saja
        console.warn('Failed to sync user to Convex:', err);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user?.id]);

  if (!isLoaded) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modals" options={{ presentation: "transparentModal", headerShown: false, animation: 'fade' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <AppConvexProvider client={convex} useAuth={useAuth}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <AuthGuard />
            <Toast config={toastConfig} position="bottom" bottomOffset={90} />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </AppConvexProvider>
    </ClerkProvider>
  );
}
