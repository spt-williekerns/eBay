/**
 * Central Theme Export
 *
 * Combines colors, typography, and spacing into a unified theme
 * for the Marshall County Auction App
 */

import { KentuckyLakeTheme, Gradients } from './colors';
import { Typography, TextStyles } from './typography';
import { Spacing } from './spacing';

export const Theme = {
  colors: KentuckyLakeTheme,
  gradients: Gradients,
  typography: Typography,
  textStyles: TextStyles,
  spacing: Spacing,
};

export type AppTheme = typeof Theme;

// Re-export for convenience
export { KentuckyLakeTheme, Gradients, Typography, TextStyles, Spacing };
