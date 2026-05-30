import { useOAuth, useSignIn } from "@/lib/clerk";
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
import { DiamondBackground } from "@/components/ui/DiamondBackground";
import Toast from "react-native-toast-message";

// Warm up the browser for OAuth
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;
    
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your email and password.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        Toast.show({
          type: "error",
          text1: "Sign In Failed",
          text2: "Please check your credentials and try again.",
        });
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.errors?.[0]?.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, email, password, signIn, setActive, router]);

  const onGoogleSignIn = useCallback(async () => {
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

  const onAppleSignIn = useCallback(async () => {
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
      <DiamondBackground />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView 
          contentContainerClassName="flex-grow px-6 pt-4 pb-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-start justify-center mb-6"
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>

          <View className="mb-12">
            <Text className="text-white font-black text-4xl mb-2 lowercase">
              welcome back.
            </Text>
            <Text className="text-gray-500 text-sm">
              let's pick up where you left off.
            </Text>
          </View>

          {/* Form */}
          <View className="gap-y-4 mb-2">
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

          <TouchableOpacity className="mb-10 items-end">
            <Text className="text-gray-500 text-xs">forgot password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity 
            className="bg-white rounded-xl h-14 items-center justify-center mb-8 flex-row"
            onPress={onSignInPress}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text className="text-black font-bold text-[17px]">
                sign in →
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-8">
            <View className="flex-1 h-[1px] bg-gray-700" />
            <Text className="text-gray-500 px-4 text-sm font-medium">or</Text>
            <View className="flex-1 h-[1px] bg-gray-700" />
          </View>

          {/* OAuth */}
          <View className="flex-row gap-x-3 mb-8">
            <TouchableOpacity 
              className="flex-1 flex-row bg-gray-950 border border-gray-700 rounded-xl h-14 items-center justify-center gap-x-2"
              onPress={onGoogleSignIn}
            >
              <FontAwesome5 name="google" size={18} color="white" />
              <Text className="text-white font-semibold">Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 flex-row bg-gray-950 border border-gray-700 rounded-xl h-14 items-center justify-center gap-x-2"
              onPress={onAppleSignIn}
            >
              <FontAwesome5 name="apple" size={20} color="white" />
              <Text className="text-white font-semibold">Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-auto pt-4">
            <Text className="text-gray-500">new here? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text className="text-white font-bold">create account</Text>
              </TouchableOpacity>
            </Link>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
