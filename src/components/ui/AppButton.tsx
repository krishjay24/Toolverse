import { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, radius, createTypography } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  fullWidth = false,
}: AppButtonProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const isDisabled = disabled || loading;

  const variantStyle = useMemo((): ViewStyle => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.primary };
      case 'secondary':
        return { backgroundColor: colors.primaryLight, borderWidth: 1, borderColor: colors.border };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'danger':
        return { backgroundColor: colors.error };
    }
  }, [variant, colors]);

  const textColor = useMemo(() => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return colors.surface;
      case 'secondary':
      case 'ghost':
        return colors.primary;
    }
  }, [variant, colors]);

  const sizeStyle: ViewStyle =
    size === 'sm'
      ? { paddingVertical: spacing.sm, paddingHorizontal: spacing.base }
      : size === 'lg'
        ? { paddingVertical: spacing.base, paddingHorizontal: spacing.xl }
        : { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyle,
        variantStyle,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.content}>
          {iconLeft ? (
            <Ionicons name={iconLeft} size={18} color={textColor} style={styles.iconLeft} />
          ) : null}
          <Text style={[typography.button, { color: textColor }]}>{title}</Text>
          {iconRight ? (
            <Ionicons name={iconRight} size={18} color={textColor} style={styles.iconRight} />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
});
