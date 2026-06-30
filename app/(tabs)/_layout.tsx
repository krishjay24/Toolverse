import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, spacing, radius } from '@/theme';

const TAB_BAR_BASE_HEIGHT = 72;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const bottomPadding = Math.max(insets.bottom, spacing.base);
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.label,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingTop: spacing.sm,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          borderTopLeftRadius: radius.tabBar,
          borderTopRightRadius: radius.tabBar,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          ...(Platform.OS === 'android' ? { elevation: 4 } : {}),
        },
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Tools',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'time' : 'time-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    paddingTop: spacing.xs,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 2,
  },
});
