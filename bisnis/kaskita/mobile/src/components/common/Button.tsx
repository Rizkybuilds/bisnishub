// ============================================================================
// COMMON BUTTON COMPONENT
// File: src/components/common/Button.tsx
// ============================================================================

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../../theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  style,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        isDisabled && styles.disabled,
        style as ViewStyle,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.primaryForeground}
        />
      ) : (
        <>
          {icon ? <>{icon}</> : null}
          <Text
            style={[
              styles.textBase,
              textStyles[variant],
              textStyles[`size_${size}`],
              isDisabled && styles.disabledText,
              icon ? { marginLeft: Spacing.sm } : undefined,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  danger: {
    backgroundColor: Colors.expense,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Sizes (Touch target >= 44dp/48dp)
  size_sm: {
    height: 38,
    paddingHorizontal: Spacing.md,
  },
  size_md: {
    height: 48,
    paddingHorizontal: Spacing.xl,
  },
  size_lg: {
    height: 54,
    paddingHorizontal: Spacing.xxl,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: Colors.border,
  },
  disabledText: {
    color: Colors.foregroundSubtle,
  },
  textBase: {
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
  },
});

const textStyles = StyleSheet.create({
  primary: {
    color: Colors.primaryForeground,
  },
  secondary: {
    color: Colors.primaryForeground,
  },
  outline: {
    color: Colors.foreground,
  },
  danger: {
    color: Colors.primaryForeground,
  },
  ghost: {
    color: Colors.primary,
  },
  size_sm: {
    fontSize: Typography.sizes.caption,
  },
  size_md: {
    fontSize: Typography.sizes.body,
  },
  size_lg: {
    fontSize: Typography.sizes.subtitle,
  },
});
