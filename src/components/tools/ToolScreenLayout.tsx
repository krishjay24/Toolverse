import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { AppHeader } from '@/components/ui/AppHeader';
import { useTheme, spacing } from '@/theme';

interface ToolScreenLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentStyle?: ViewStyle;
  infoIcon?: 'information-circle-outline' | 'help-circle-outline';
  onInfoPress?: () => void;
}

export function ToolScreenLayout({
  title,
  subtitle,
  children,
  footer,
  contentStyle,
  infoIcon,
  onInfoPress,
}: ToolScreenLayoutProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader
        title={title}
        subtitle={subtitle}
        showBack
        infoIcon={infoIcon}
        onInfoPress={onInfoPress}
      />
      <ScrollView
        contentContainerStyle={[styles.content, contentStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
        {footer}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.section,
    paddingBottom: spacing['3xl'],
    gap: spacing.base,
  },
});
