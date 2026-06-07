import { create } from 'zustand';
import Constants from 'expo-constants';

export type ThemePreference = 'light' | 'dark' | 'system';

const DEMO_EMAIL = 'demo@toolverse.app';
const DEMO_PASSWORD = 'toolverse123';

interface AppState {
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;
  appVersion: string;
  isGuest: boolean;
  isLoggedIn: boolean;
  userName: string | null;
  userEmail: string | null;
  hasSession: boolean;
  loginDemo: (email: string, password: string) => boolean;
  continueAsGuest: () => void;
  logout: () => void;
  getUserLabel: () => string;
}

export const useAppStore = create<AppState>((set, get) => ({
  themePreference: 'system',
  setThemePreference: (themePreference) => set({ themePreference }),
  appVersion: Constants.expoConfig?.version ?? '1.0.0',
  isGuest: false,
  isLoggedIn: false,
  userName: null,
  userEmail: null,
  hasSession: false,

  loginDemo: (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
      set({
        isLoggedIn: true,
        isGuest: false,
        hasSession: true,
        userName: 'Demo User',
        userEmail: DEMO_EMAIL,
      });
      return true;
    }
    return false;
  },

  continueAsGuest: () => {
    set({
      isGuest: true,
      isLoggedIn: false,
      hasSession: true,
      userName: null,
      userEmail: null,
    });
  },

  logout: () => {
    set({
      isGuest: false,
      isLoggedIn: false,
      hasSession: false,
      userName: null,
      userEmail: null,
    });
  },

  getUserLabel: () => {
    const state = get();
    if (state.isLoggedIn && state.userName) {
      return state.userName;
    }
    if (state.isGuest) {
      return 'Guest';
    }
    return 'Guest';
  },
}));
