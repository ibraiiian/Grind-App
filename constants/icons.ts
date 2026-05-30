/**
 * GRIND App — Icon Map
 * Source: PRD v2.0 Section 5 & FR-2.2
 *
 * Maps icon keys to Expo Vector Icons (MaterialCommunityIcons).
 * Used for folder icons and prompt icons — 6 preset choices.
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/**
 * Icon key → Expo Vector Icons name mapping
 * 6 presets: crown, bolt, star, starOutline, smiley, crazy
 */
export const iconMap: Record<string, IconName> = {
  crown: 'crown',
  bolt: 'lightning-bolt',
  star: 'star-four-points',
  starOutline: 'star-four-points-outline',
  smiley: 'emoticon-happy-outline',
  crazy: 'emoticon-excited-outline',
} as const;

/** All available icon keys for folder/prompt picker */
export const iconKeys = Object.keys(iconMap) as Array<keyof typeof iconMap>;
