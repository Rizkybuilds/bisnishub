// ============================================================================
// KASKITA DESIGN TOKENS (Modern Emerald & Clean Slate)
// File: src/theme/tokens.ts
// ============================================================================

export const Colors = {
  // Brand & Primary
  primary: '#059669', // Emerald 600
  primaryHover: '#047857',
  primaryLight: '#ECFDF5', // Emerald 50
  primaryForeground: '#FFFFFF',

  // Secondary & Accents
  secondary: '#F59E0B', // Amber Gold (Arisan & Pending)
  secondaryLight: '#FEF3C7',
  secondaryForeground: '#78350F',

  // Background & Surfaces
  background: '#F8FAFC', // Slate 50
  card: '#FFFFFF',
  cardSecondary: '#F1F5F9', // Slate 100

  // Text & Foregrounds
  foreground: '#0F172A', // Deep Slate 900
  foregroundMuted: '#64748B', // Slate 500
  foregroundSubtle: '#94A3B8', // Slate 400

  // Dividers & Borders
  border: '#E2E8F0', // Slate 200
  borderFocus: '#059669',

  // Financial States
  expense: '#EF4444', // Red 500 (-)
  expenseLight: '#FEF2F2',
  income: '#10B981', // Emerald 500 (+)
  incomeLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  info: '#3B82F6',
  infoLight: '#EFF6FF',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 16, // Default card
  xl: 24,
  full: 9999,
};

export const Typography = {
  fontFamily: 'System', // Plus Jakarta Sans / System
  sizes: {
    hero: 30,
    title: 22,
    subtitle: 18,
    body: 14,
    caption: 12,
    micro: 10,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
};
