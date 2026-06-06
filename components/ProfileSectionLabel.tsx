import { View, Text } from 'react-native';

type ProfileSectionLabelProps = {
  label: string;
  topSpacing?: boolean;
};

export function ProfileSectionLabel({
  label,
  topSpacing = true
}: ProfileSectionLabelProps) {
  return (
    <Text
      className={`text-xs text-gray-600 uppercase tracking-widest ${topSpacing ? 'mt-6' : ''} mb-2`}
    >
      {label}
    </Text>
  );
}
