import { View, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type OrnamentProps = { style?: ViewStyle };

// Bintang ✦ besar
export function SparkleOrnament({ style }: OrnamentProps) {
  return (
    <Text style={[{ color: '#333333', fontSize: 18, lineHeight: 20 }, style]}>
      ✦
    </Text>
  );
}

// Bintang ✧ kecil
export function SparkleSmOrnament({ style }: OrnamentProps) {
  return (
    <Text style={[{ color: '#222222', fontSize: 11, lineHeight: 14 }, style]}>
      ✦
    </Text>
  );
}

// Grid dots 3x3
export function DotsGridOrnament({ style }: OrnamentProps) {
  return (
    <View style={[{ gap: 3 }, style]}>
      {[0, 1, 2].map((row) => (
        <View key={row} style={{ flexDirection: 'row', gap: 3 }}>
          {[0, 1, 2].map((col) => (
            <View
              key={col}
              style={{
                width: 3,
                height: 3,
                borderRadius: 999,
                backgroundColor: '#222222',
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

// Badge "locked in"
export function LockedInBadge({ style }: OrnamentProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3,
          borderWidth: 1,
          borderColor: '#333333',
          borderRadius: 999,
          paddingHorizontal: 7,
          paddingVertical: 3,
        },
        style,
      ]}
    >
      <Ionicons name="lock-closed" size={8} color="#555555" />
      <Text style={{ color: '#555555', fontSize: 8, fontWeight: '700', letterSpacing: 0.5 }}>
        locked in
      </Text>
    </View>
  );
}

// Smiley ☺
export function SmileyOrnament({ style }: OrnamentProps) {
  return (
    <Text style={[{ color: '#222222', fontSize: 18 }, style]}>☺</Text>
  );
}
