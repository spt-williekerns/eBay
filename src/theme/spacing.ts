/**
 * Spacing System
 *
 * Design Choices:
 * - Large touch targets: Minimum 60px for senior users with reduced dexterity
 * - Generous padding: Reduces accidental taps, improves visual clarity
 * - Consistent spacing: Creates predictable, learnable interface
 */

export const Spacing = {
  // Base spacing unit (8px)
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,

  // Touch targets (extra large for seniors)
  touchTarget: {
    minimum: 60,    // Minimum touch target size
    button: 80,     // Primary button height
    icon: 64,       // Icon button size
  },

  // Screen padding
  screen: {
    horizontal: 24,
    vertical: 32,
  },

  // Card spacing
  card: {
    padding: 24,
    margin: 16,
    radius: 16,     // Rounded corners for friendliness
  },
};
