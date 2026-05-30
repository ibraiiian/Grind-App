import { useAuth } from "@/lib/clerk";
import { Link, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions, Platform, StyleSheet } from "react-native";
import { DottedBackground } from "@/components/ui/DottedBackground";
import { FontAwesome5 } from "@expo/vector-icons";

// Import SVG Assets
import LockedInSticker from "@/assets/stickers/locked-in.svg";
import SmileyDoodle from "@/assets/doodles/smiley.svg";
import HeartOutline from "@/assets/doodles/heart-outline.svg";
import StarHanddrawn from "@/assets/doodles/star-handdrawn.svg";
import SparklesPair from "@/assets/doodles/sparkles-pair.svg";
import DeadSmiley from "@/assets/doodles/dead-smiley.svg";

export default function SplashScreen() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { width } = Dimensions.get("window");
  
  const handleLetsGo = () => {
    if (isSignedIn) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/sign-up");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DottedBackground />
      
      {/* Decorative Doodles & Stickers using absolute positioning */}
      <View style={[styles.absolute, { top: 70, left: 24, transform: [{ rotate: "-8deg" }] }]}>
        <LockedInSticker width={120} height={45} />
      </View>
      
      <View style={[styles.absolute, { top: 80, right: 32 }]}>
        <SmileyDoodle width={50} height={50} />
      </View>
      
      <View style={[styles.absolute, { top: 180, left: 32 }]}>
        <HeartOutline width={20} height={20} />
      </View>
      
      <View style={[styles.absolute, { top: 130, right: width * 0.25 }]}>
        <SparklesPair width={40} height={40} />
      </View>

      <View style={[styles.absolute, { bottom: 250, left: 40 }]}>
        <DeadSmiley width={45} height={45} />
      </View>
      
      {/* let's cook sticker mock */}
      <View style={[
        styles.absolute, 
        styles.sticker,
        { bottom: 280, right: 30, transform: [{ rotate: "12deg" }] }
      ]}>
        <Text style={styles.stickerText}>let's cook 🔥</Text>
      </View>
      
      {/* good vibes sticker mock */}
      <View style={[
        styles.absolute,
        styles.sticker,
        { bottom: 220, left: 30, transform: [{ rotate: "-6deg" }] }
      ]}>
        <Text style={styles.stickerText}>good vibes ✨</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.logoText}>GRIND</Text>
        <Text style={styles.subtitle}>
          built for the grind.
        </Text>
      </View>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <View style={{ position: 'relative' }}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleLetsGo}
          >
            <Text style={styles.buttonText}>
              let's go ➔
            </Text>
          </TouchableOpacity>
          
          {/* Star Icon overlapping the button corner */}
          <View style={styles.buttonStar}>
            <FontAwesome5 name="star" size={14} color="white" solid />
          </View>
        </View>
        
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>already grinding? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity>
              <Text style={styles.signInLink}>sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Hardcode to guarantee black background
    position: 'relative',
  },
  absolute: {
    position: 'absolute',
    zIndex: 5,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 10,
    marginTop: -50,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: Platform.OS === 'web' ? 140 : 110,
    lineHeight: Platform.OS === 'web' ? 140 : 110,
    fontFamily: Platform.OS === 'web' ? 'Impact, sans-serif' : 'System',
    transform: [{ scaleY: Platform.OS === 'web' ? 1.6 : 1.8 }, { scaleX: Platform.OS === 'web' ? 0.85 : 0.9 }],
    letterSpacing: -2,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 40, // push down slightly due to scaleY
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 2,
  },
  sticker: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    backgroundColor: '#000000',
  },
  stickerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    width: '100%',
    zIndex: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 22,
  },
  buttonStar: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signInText: {
    color: '#888888',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
  },
  signInLink: {
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
