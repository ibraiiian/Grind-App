import { View, Text } from 'react-native';

type StatsCardProps = {
  value: number | undefined;
  label: string;
};

export function StatsCard({ value, label }: StatsCardProps) {
  return (
    <View className="flex-1 bg-gray-950 border border-gray-700
                     rounded-xl py-4 items-center justify-center">
      <Text className="font-black text-2xl text-white">
        {value !== undefined ? value : '—'}
      </Text>
      <Text className="text-xs text-gray-500 mt-1">{label}</Text>
    </View>
  );
}
