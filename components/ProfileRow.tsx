import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ProfileRowProps = {
  label: string;
  // Salah satu dari berikut:
  onPress?: () => void;           // → tampilkan chevron kanan
  rightText?: string;             // teks di kanan
  rightBadge?: string;            // badge bordered di kanan
  switchValue?: boolean;          // → tampilkan Switch
  onSwitchChange?: (val: boolean) => void;
  switchDisabled?: boolean;       // locked toggle
  lockIcon?: boolean;             // tampilkan lock icon sebelum switch
  showChevron?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
};

export function ProfileRow({
  label,
  onPress,
  rightText,
  rightBadge,
  switchValue,
  onSwitchChange,
  switchDisabled,
  lockIcon,
  showChevron,
  isFirst,
  isLast,
}: ProfileRowProps) {
  const content = (
    <View
      className={`px-4 h-14 flex-row items-center bg-gray-950
                  ${isFirst ? 'rounded-t-2xl' : ''}
                  ${isLast ? 'rounded-b-2xl' : ''}`}
    >
      {/* Label */}
      <Text className="flex-1 text-white text-sm">{label}</Text>

      {/* Right content */}
      {rightText && (
        <Text className="text-gray-500 text-sm mr-2">{rightText}</Text>
      )}
      {rightBadge && (
        <View className="border border-gray-700 rounded-md px-2 py-0.5 mr-2">
          <Text className="text-xs text-gray-400">{rightBadge}</Text>
        </View>
      )}
      {lockIcon && (
        <Ionicons name="lock-closed-outline" size={14} color="#555555" style={{ marginRight: 8 }} />
      )}
      {switchValue !== undefined && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          disabled={switchDisabled}
          trackColor={{ false: '#333333', true: '#FFFFFF' }}
          thumbColor={switchValue ? '#000000' : '#888888'}
          style={{ opacity: switchDisabled ? 0.4 : 1 }}
        />
      )}
      {showChevron && (
        <Ionicons name="chevron-forward" size={16} color="#555555" />
      )}
    </View>
  );

  // Divider bawah (kecuali row terakhir)
  return (
    <View>
      {onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
      {!isLast && (
        <View className="h-px bg-gray-800 mx-4" />
      )}
    </View>
  );
}
