/**
 * Typography System for Senior Accessibility
 *
 * Design Choices:
 * - 40pt minimum font size: Critical for senior users with vision impairment
 * - System fonts: Built-in accessibility features (scaling, boldness)
 * - High line-height: Improves readability, reduces eye strain
 * - Limited font weights: Avoids thin fonts that are hard to read
 */

import { Platform } from 'react-native';

export const Typography = {
  // Font Families
  fontFamily: {
    regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
    bold: Platform.OS === 'ios' ? 'System' : 'Roboto',
    banjo: 'BanjoFont', // Custom font for Kentucky theme (fallback to system)
  },

  // Font Sizes - All 40pt or larger for seniors
  fontSize: {
    jumbo: 56,      // Auction prices, countdowns (extra large)
    huge: 48,       // Page titles, winning bids
    large: 44,      // Section headers
    base: 40,       // Body text, buttons (MINIMUM size)
    small: 36,      // Secondary text (still large enough)
  },

  // Font Weights - Only medium and bold (no thin weights)
  fontWeight: {
    normal: '500' as const,  // Medium weight for readability
    bold: '700' as const,    // Bold for emphasis
    heavy: '900' as const,   // Extra bold for critical info
  },

  // Line Heights - Generous spacing for readability
  lineHeight: {
    tight: 1.2,    // Compact headers
    normal: 1.5,   // Default body text
    relaxed: 1.8,  // Maximum readability
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,     // Easier to read for seniors
  },
};

/**
 * Pre-configured text styles for common use cases
 */
export const TextStyles = {
  // Primary heading style (page titles)
  h1: {
    fontSize: Typography.fontSize.huge,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.fontSize.huge * Typography.lineHeight.tight,
    letterSpacing: Typography.letterSpacing.normal,
  },

  // Section headers
  h2: {
    fontSize: Typography.fontSize.large,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.fontSize.large * Typography.lineHeight.tight,
  },

  // Button text (must be highly visible)
  button: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.heavy,
    letterSpacing: Typography.letterSpacing.wide,
    textTransform: 'uppercase' as const,
  },

  // Body text
  body: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },

  // Price displays (extra emphasis)
  price: {
    fontSize: Typography.fontSize.jumbo,
    fontWeight: Typography.fontWeight.heavy,
    lineHeight: Typography.fontSize.jumbo * Typography.lineHeight.tight,
  },

  // Countdown timer
  timer: {
    fontSize: Typography.fontSize.jumbo,
    fontWeight: Typography.fontWeight.heavy,
    fontFamily: Typography.fontFamily.banjo, // Fun Kentucky theme
  },
};
