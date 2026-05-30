import { View, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const SIZE = Math.max(width, height) * 1.5;

export function DiamondBackground() {
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none items-center justify-center">
      <View 
        className="absolute border border-[#1A1A1A]"
        style={{ width: SIZE, height: SIZE, transform: [{ rotate: "45deg" }] }}
      />
      <View 
        className="absolute border border-[#1A1A1A]"
        style={{ width: SIZE * 0.75, height: SIZE * 0.75, transform: [{ rotate: "45deg" }] }}
      />
      <View 
        className="absolute border border-[#1A1A1A]"
        style={{ width: SIZE * 0.5, height: SIZE * 0.5, transform: [{ rotate: "45deg" }] }}
      />
      <View 
        className="absolute border border-[#1A1A1A]"
        style={{ width: SIZE * 0.25, height: SIZE * 0.25, transform: [{ rotate: "45deg" }] }}
      />
    </View>
  );
}
