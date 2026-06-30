import { create } from 'zustand';
import Constants from 'expo-constants';

export type ThemePreference = 'light' | 'dark' | 'system';

interface AppState {
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;
  appVersion: string;
  getUserLabel: () => string;
}

export const useAppStore = create<AppState>((set) => ({
  themePreference: 'system',
  setThemePreference: (themePreference) => set({ themePreference }),
  appVersion: Constants.expoConfig?.version ?? '1.0.0',
  getUserLabel: () => 'Guest',
}));
