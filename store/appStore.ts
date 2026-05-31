/**
 * GRIND App — App Store (Zustand)
 * Source: PRD v2.0 Section 3.1 FR-1.3
 *
 * Global app state managed by Zustand.
 * Focus Mode: hides Inbox section on Home screen.
 */

import { create } from 'zustand';

interface AppState {
  /** Focus Mode toggle — hides Inbox section on Home */
  isFocusMode: boolean;
  toggleFocusMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isFocusMode: false,
  toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
}));
