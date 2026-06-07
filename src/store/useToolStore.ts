import { create } from 'zustand';
import { HistoryEntry } from '@/types/tool';
import { getToolById } from '@/constants/tools';

const MAX_HISTORY = 50;

interface ToolState {
  history: HistoryEntry[];
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp' | 'toolTitle'> & { toolTitle?: string }) => void;
  clearHistory: () => void;
}

export const useToolStore = create<ToolState>((set) => ({
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
}));
