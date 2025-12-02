/**
 * Design Tokens
 * Centralized styling constants for consistent UI
 *
 * Usage:
 * import { COLORS, SPACING, SHADOWS, RADIUS } from './styles/designTokens';
 * className={`${COLORS.primary.bg} ${SPACING.card.padding} ${SHADOWS.card}`}
 */

// Brand Colors - Using indigo as primary brand color
export const COLORS = {
  primary: {
    bg: 'bg-indigo-600',
    bgHover: 'hover:bg-indigo-700',
    bgLight: 'bg-indigo-50',
    text: 'text-indigo-600',
    textHover: 'hover:text-indigo-700',
    border: 'border-indigo-600',
  },
  secondary: {
    bg: 'bg-gray-600',
    bgHover: 'hover:bg-gray-700',
    bgLight: 'bg-gray-50',
    text: 'text-gray-600',
    textHover: 'hover:text-gray-700',
    border: 'border-gray-600',
  },
  success: {
    bg: 'bg-green-600',
    bgHover: 'hover:bg-green-700',
    bgLight: 'bg-green-50',
    text: 'text-green-600',
    textHover: 'hover:text-green-700',
    border: 'border-green-600',
  },
  danger: {
    bg: 'bg-red-600',
    bgHover: 'hover:bg-red-700',
    bgLight: 'bg-red-50',
    text: 'text-red-600',
    textHover: 'hover:text-red-700',
    border: 'border-red-600',
  },
  warning: {
    bg: 'bg-amber-600',
    bgHover: 'hover:bg-amber-700',
    bgLight: 'bg-amber-50',
    text: 'text-amber-600',
    textHover: 'hover:text-amber-700',
    border: 'border-amber-600',
  },
  neutral: {
    white: 'bg-white',
    gray100: 'bg-gray-100',
    gray200: 'bg-gray-200',
    gray800: 'bg-gray-800',
    gray900: 'bg-gray-900',
  },
};

// Spacing & Padding
export const SPACING = {
  card: {
    padding: 'p-6',
    paddingLarge: 'p-8',
  },
  section: {
    marginBottom: 'mb-6',
  },
  button: {
    padding: 'px-6 py-3',
    paddingSmall: 'px-4 py-2',
    paddingLarge: 'px-8 py-4',
  },
  gap: {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  },
};

// Shadows
export const SHADOWS = {
  card: 'shadow-md',
  cardHover: 'hover:shadow-lg',
  cardLarge: 'shadow-lg',
  modal: 'shadow-xl',
  prominent: 'shadow-2xl',
  none: 'shadow-none',
};

// Border Radius
export const RADIUS = {
  small: 'rounded',
  medium: 'rounded-lg',
  large: 'rounded-xl',
  extraLarge: 'rounded-2xl',
  full: 'rounded-full',
};

// Typography
export const TYPOGRAPHY = {
  heading: {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-bold',
    h3: 'text-xl font-semibold',
    h4: 'text-lg font-semibold',
  },
  body: {
    large: 'text-lg',
    base: 'text-base',
    small: 'text-sm',
    tiny: 'text-xs',
  },
  weight: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },
};

// Common Component Styles (Preset Combinations)
export const COMPONENT_STYLES = {
  // Card Variations
  card: {
    base: `${COLORS.neutral.white} ${RADIUS.medium} ${SHADOWS.card} ${SPACING.card.padding}`,
    prominent: `${COLORS.neutral.white} ${RADIUS.large} ${SHADOWS.cardLarge} ${SPACING.card.paddingLarge}`,
    interactive: `${COLORS.neutral.white} ${RADIUS.medium} ${SHADOWS.card} ${SPACING.card.padding} transition-shadow ${SHADOWS.cardHover}`,
  },

  // Modal Styles
  modal: {
    overlay: 'fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50',
    container: `${COLORS.neutral.white} ${RADIUS.large} ${SHADOWS.modal} ${SPACING.card.paddingLarge} max-w-lg w-full`,
  },

  // Input Styles
  input: {
    base: `w-full px-4 py-3 ${RADIUS.medium} border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`,
    error: `w-full px-4 py-3 ${RADIUS.medium} border-2 border-red-500 focus:ring-2 focus:ring-red-500`,
  },

  // Container Styles
  container: {
    page: 'min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50',
    centered: 'flex items-center justify-center min-h-screen p-4',
    content: 'max-w-md mx-auto',
  },
};

// Gradients
export const GRADIENTS = {
  primary: 'bg-gradient-to-r from-indigo-600 to-purple-600',
  success: 'bg-gradient-to-r from-green-600 to-emerald-600',
  danger: 'bg-gradient-to-r from-red-600 to-pink-600',
  background: 'bg-gradient-to-br from-indigo-50 via-white to-purple-50',
};

// Transitions
export const TRANSITIONS = {
  default: 'transition-all duration-200',
  slow: 'transition-all duration-300',
  fast: 'transition-all duration-100',
};

// Gender Button Colors (Specific to the app)
export const GENDER_COLORS = {
  male: 'bg-indigo-600 hover:bg-indigo-700',
  female: 'bg-purple-600 hover:bg-purple-700',
};
