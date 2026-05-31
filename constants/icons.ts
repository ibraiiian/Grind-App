import { Ionicons } from '@expo/vector-icons';

export const FOLDER_ICONS = {
  crown: 'ribbon-outline',
  bolt: 'flash-outline',
  star: 'star-outline',
  starOutline: 'sparkles-outline',
  smiley: 'happy-outline',
  crazy: 'skull-outline',
} as const;

export type FolderIconKey = keyof typeof FOLDER_ICONS;

export const FOLDER_ICON_KEYS: FolderIconKey[] = [
  'crown', 'bolt', 'star', 'starOutline', 'smiley', 'crazy'
];
