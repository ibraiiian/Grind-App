import { create } from 'zustand';

interface AppStore {
  // Focus mode
  isFocusMode: boolean;
  toggleFocusMode: () => void;

  // Task filter (Global Task List)
  activeTaskFilter: 'all' | 'urgent' | 'today' | 'thisWeek' | 'done';
  setTaskFilter: (filter: AppStore['activeTaskFilter']) => void;

  // Selected folder filter (Global Task List)
  selectedFolderFilter: string | null;
  setFolderFilter: (folderId: string | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isFocusMode: false,
  toggleFocusMode: () => set((s) => ({ isFocusMode: !s.isFocusMode })),

  activeTaskFilter: 'all',
  setTaskFilter: (filter) => set({ activeTaskFilter: filter }),

  selectedFolderFilter: null,
  setFolderFilter: (folderId) => set({ selectedFolderFilter: folderId }),
}));
