import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export type ThemePreference = 'light' | 'dark' | 'system';

interface AppState {
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;
  appVersion: string;
  getUserLabel: () => string;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      setThemePreference: (themePreference) => set({ themePreference }),
      appVersion: Constants.expoConfig?.version ?? '1.0.0',
      getUserLabel: () => 'Guest',
    }),
    {
      name: 'toolverse-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ themePreference: state.themePreference }),
    },
  ),
);
