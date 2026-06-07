import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme, spacing, radius } from '@/theme';

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padded?: boolean;
  border?: boolean;
  disabled?: boolean;
}

export function AppCard({
  children,
  onPress,
  style,
  padded = true,
  border = true,
  disabled = false,
}: AppCardProps) {
  const { colors } = useTheme();

  const content = (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface },
        padded && styles.padded,
        border && { borderWidth: 1, borderColor: colors.border },
        disabled && styles.disabled,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
  },
  padded: {
    padding: spacing.base,
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.6,
  },
});
