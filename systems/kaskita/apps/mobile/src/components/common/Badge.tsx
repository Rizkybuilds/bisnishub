// ============================================================================
// COMMON BADGE COMPONENT
// File: src/components/common/Badge.tsx
// ============================================================================

import React from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../../theme/tokens';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps extends ViewProps {
  label: string;
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', style, ...props }) => {
  return (
    <View style={[styles.base, styles[variant], style]} {...props}>
      <Text style={[styles.text, textStyles[variant]]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  success: {
    backgroundColor: '#DEF7EC',
  },
  warning: {
    backgroundColor: Colors.secondaryLight,
  },
  danger: {
    backgroundColor: Colors.expenseLight,
  },
  info: {
    backgroundColor: Colors.infoLight,
  },
  neutral: {
    backgroundColor: Colors.cardSecondary,
  },
  text: {
    fontSize: Typography.sizes.micro,
    fontWeight: Typography.weights.bold,
  },
});

const textStyles = StyleSheet.create({
  success: {
    color: '#03543F',
  },
  warning: {
    color: Colors.secondaryForeground,
  },
  danger: {
    color: Colors.expense,
  },
  info: {
    color: Colors.info,
  },
  neutral: {
    color: Colors.foregroundMuted,
  },
});
