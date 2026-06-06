import { useOAuth, useSignUp, isDummyKey } from "@/lib/clerk";
import { Link, useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { DottedBackground } from "@/components/ui/DottedBackground";
import { toast } from '@/lib/toast';
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Warm up the browser for OAuth
WebBrowser.maybeCompleteAuthSession();

// Validation schema
const signUpSchema = z.object({
  fullName: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });
  const upsertUser = useMutation(api.users.upsertUser);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSignUpPress = useCallback(async () => {
    if (!isLoaded) return;

    // Validate
    const result = signUpSchema.safeParse({ fullName, email, password });
    if (!result.success) {
      const firstIssue = result.error.issues?.[0];
      toast.error('Validation Error', firstIssue?.message || 'Invalid input');
      return;
    }

    setIsLoading(true);

    try {
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || undefined;

      const signUpAttempt = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        
        // Sync to Convex
        if (!isDummyKey) {
          await upsertUser({
            clerkId: signUpAttempt.createdUserId ?? '',
            email: email,
            name: fullName,
          });
        }

        router.replace("/(tabs)");
      } else {
        // Needs email verification (if configured in Clerk)
        // Note: PRD doesn't mention OTP screen, assuming auto-verify or no verify for MVP
        toast.info('Check your email', 'A verification code might have been sent.');
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      
      let errorMsg: string | null = "Something went wrong.";
      if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        errorMsg = err.errors[0].message;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      
      toast.error('Error', errorMsg || 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, email, password, fullName, signUp, setActive, router, upsertUser]);

  const onGoogleSignUp = useCallback(async () => {
    try {
      const { createdSessionId, setActive: setOAuthActive } = await googleAuth();
      if (createdSessionId) {
        setOAuthActive?.({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [googleAuth, router]);

  const onAppleSignUp = useCallback(async () => {
    try {
      const { createdSessionId, setActive: setOAuthActive } = await appleAuth();
      if (createdSessionId) {
        setOAuthActive?.({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [appleAuth, router]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <DottedBackground />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView 
          contentContainerClassName="flex-grow px-6 pt-4 pb-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / Header */}
          <View className="items-center mb-10">
            <Text className="text-white font-black text-2xl tracking-widest">
              GRIND
            </Text>
          </View>

          <View className="mb-10">
            <Text className="text-white font-black text-4xl mb-2 lowercase">
              create account.
            </Text>
            <Text className="text-gray-500 text-sm">
              join the grind.
            </Text>
          </View>

          {/* Form */}
          <View className="gap-y-4 mb-8">
            <TextInput
              className="bg-gray-900 border border-gray-700 rounded-xl h-14 px-4 text-white text-base"
              placeholder="full name"
              placeholderTextColor="#888888"
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
            />

            <TextInput
              className="bg-gray-900 border border-gray-700 rounded-xl h-14 px-4 text-white text-base"
              placeholder="email address"
              placeholderTextColor="#888888"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <View className="relative justify-center">
              <TextInput
                className="bg-gray-900 border border-gray-700 rounded-xl h-14 pl-4 pr-12 text-white text-base"
                placeholder="password"
                placeholderTextColor="#888888"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                className="absolute right-4 h-full justify-center"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather 
                  name={showPassword ? "eye" : "eye-off"} 
                  size={20} 
                  color="#888888" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            className="bg-white rounded-xl h-14 items-center justify-center mb-8 flex-row"
            onPress={onSignUpPress}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text className="text-black font-bold text-[17px]">
                sign up →
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-8">
            <View className="flex-1 h-[1px] bg-gray-700" />
            <Text className="text-gray-500 px-4 text-sm font-medium">or continue with</Text>
            <View className="flex-1 h-[1px] bg-gray-700" />
          </View>

          {/* OAuth */}
          <View className="flex-row gap-x-3 mb-8">
            <TouchableOpacity 
              className="flex-1 flex-row bg-gray-950 border border-gray-700 rounded-xl h-14 items-center justify-center gap-x-2"
              onPress={onGoogleSignUp}
            >
              <FontAwesome5 name="google" size={18} color="white" />
              <Text className="text-white font-semibold">continue with google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 flex-row bg-gray-950 border border-gray-700 rounded-xl h-14 items-center justify-center gap-x-2"
              onPress={onAppleSignUp}
            >
              <FontAwesome5 name="apple" size={20} color="white" />
              <Text className="text-white font-semibold">continue with apple</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-auto pt-4">
            <Text className="text-gray-500">already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text className="text-white font-bold underline">sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
