// ============================================================================
// COMMON CARD COMPONENT
// File: src/components/common/Card.tsx
// ============================================================================

import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../../theme/tokens';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  style,
  ...props
}) => {
  return (
    <View
      style={[
        styles.base,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        variant === 'flat' && styles.flat,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  elevated: {
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  flat: {
    backgroundColor: Colors.cardSecondary,
  },
});
