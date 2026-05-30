import { View, Dimensions } from "react-native";
import { cn } from "@/lib/utils";

const { width, height } = Dimensions.get("window");
const DOT_SIZE = 2;
const SPACING = 30;

const cols = Math.ceil(width / SPACING);
const rows = Math.ceil(height / SPACING);

export function DottedBackground() {
  const dots = [];

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      dots.push(
        <View
          key={`${i}-${j}`}
          className="absolute rounded-full bg-[#1A1A1A]"
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            left: i * SPACING,
            top: j * SPACING,
          }}
        />
      );
    }
  }

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
      {dots}
    </View>
  );
}
