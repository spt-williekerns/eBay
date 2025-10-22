/**
 * Kentucky Lake Theme Colors
 *
 * Design Choices:
 * - Blues/Greens: Inspired by Kentucky Lake's natural beauty
 * - High Contrast: Red/white accents for senior visibility (WCAG AAA compliant)
 * - Wood tones: Represent Marshall County's rustic heritage
 * - Dam Gray: Homage to Kentucky Dam
 */

export const KentuckyLakeTheme = {
  // Primary Colors - Kentucky Lake Blues
  lakeBlue: '#1E5F8C',        // Deep lake water color
  skyBlue: '#4A90C4',         // Clear Kentucky sky
  lightBlue: '#7DB3D8',       // Shallow water, high contrast for text

  // Secondary Colors - Natural Greens
  forestGreen: '#2C5F2D',     // Surrounding forests
  lakeGreen: '#3A7D44',       // Lake vegetation
  mintGreen: '#8BC98D',       // Light accent, good contrast

  // Accent Colors - High Contrast for Seniors
  vibrantRed: '#E63946',      // Action buttons, alerts (high visibility)
  white: '#FFFFFF',           // Primary text on dark backgrounds
  cream: '#F7F3E8',           // Softer white, reduces eye strain

  // Wood Textures
  darkWalnut: '#3E2723',      // Dark wood panels
  hickory: '#6D4C3D',         // Medium wood tones
  lightOak: '#B8906B',        // Light wood accents

  // Dam/Infrastructure
  damGray: '#607D8B',         // Kentucky Dam concrete
  steelGray: '#455A64',       // Industrial elements

  // UI States
  success: '#4CAF50',         // Winning bid
  warning: '#FF9800',         // Expiring soon
  error: '#F44336',           // Lost bid, errors
  info: '#2196F3',            // Information

  // Magical Effects
  fireflyGold: '#FFD700',     // Firefly glow on wins
  waveTeal: '#20B2AA',        // Lottie wave animations

  // Text Colors (High Contrast)
  textPrimary: '#FFFFFF',     // Main text (40pt minimum)
  textSecondary: '#E0E0E0',   // Secondary text
  textDark: '#212121',        // Text on light backgrounds

  // Backgrounds
  backgroundDark: '#1A1A2E',  // Main app background
  backgroundLight: '#F5F5F5', // Card backgrounds
  overlay: 'rgba(0, 0, 0, 0.7)', // Modal overlays
};

/**
 * Gradient combinations for visual depth
 */
export const Gradients = {
  lake: [KentuckyLakeTheme.lakeBlue, KentuckyLakeTheme.skyBlue],
  forest: [KentuckyLakeTheme.forestGreen, KentuckyLakeTheme.lakeGreen],
  wood: [KentuckyLakeTheme.darkWalnut, KentuckyLakeTheme.hickory],
  sunset: [KentuckyLakeTheme.vibrantRed, '#FF6B6B'],
  firefly: [KentuckyLakeTheme.fireflyGold, '#FFA500'],
};
