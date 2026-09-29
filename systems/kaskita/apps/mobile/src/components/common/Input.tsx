// ============================================================================
// COMMON INPUT COMPONENT
// File: src/components/common/Input.tsx
// ============================================================================

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../../theme/tokens';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  prefix,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          error ? styles.inputError : undefined,
        ]}
      >
        {prefix && <Text style={styles.prefixText}>{prefix}</Text>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.foregroundSubtle}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
    color: Colors.foregroundMuted,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  inputError: {
    borderColor: Colors.expense,
  },
  prefixText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.foregroundMuted,
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.body,
    color: Colors.foreground,
    paddingVertical: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.sizes.micro,
    color: Colors.expense,
    marginTop: Spacing.xs,
  },
});
