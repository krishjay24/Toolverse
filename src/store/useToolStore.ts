import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryEntry } from '@/types/tool';
import { getToolById } from '@/constants/tools';

const MAX_HISTORY = 50;

interface ToolState {
  history: HistoryEntry[];
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp' | 'toolTitle'> & { toolTitle?: string }) => void;
  clearHistory: () => void;
}

export const useToolStore = create<ToolState>()(
  persist(
    (set) => ({
      history: [],

      addHistoryEntry: (entry) =>
        set((state) => {
          const tool = getToolById(entry.toolId);
          const newEntry: HistoryEntry = {
            toolId: entry.toolId,
            toolTitle: entry.toolTitle ?? tool?.title ?? entry.toolId,
            summary: entry.summary,
            id: `${entry.toolId}-${Date.now()}`,
            timestamp: Date.now(),
          };
          return {
            history: [newEntry, ...state.history].slice(0, MAX_HISTORY),
          };
        }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'toolverse-tool-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ history: state.history }),
    },
  ),
);
