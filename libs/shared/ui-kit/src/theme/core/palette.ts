import COLORS from './colors.json';
import { varAlpha, createPaletteChannel } from '../styles';

// ----------------------------------------------------------------------

// Grey
export const grey = createPaletteChannel(COLORS.grey);

// Primary
export const primary = createPaletteChannel(COLORS.primary);

// Secondary
export const secondary = createPaletteChannel(COLORS.secondary);

// Info
export const info = createPaletteChannel(COLORS.info);

// Success
export const success = createPaletteChannel(COLORS.success);

// Warning
export const warning = createPaletteChannel(COLORS.warning);

// Error
export const error = createPaletteChannel(COLORS.error);

// Common
export const common = createPaletteChannel(COLORS.common);

// Text
export const text = {
  light: { primary: grey[900], secondary: grey[600], disabled: grey[500] },
  dark: { primary: '#FFFFFF', secondary: grey[400], disabled: grey[600] },
};

// Background - Pure white for light, pure black for dark
export const background = {
  light: { paper: '#FFFFFF', default: '#FFFFFF' },
  dark: { paper: '#000000', default: '#000000' },  // Pure black
};

// Action
const baseAction = {
  hover: varAlpha(grey['500Channel'], 0.08),
  selected: varAlpha(grey['500Channel'], 0.16),
  focus: varAlpha(grey['500Channel'], 0.24),
  disabled: varAlpha(grey['500Channel'], 0.8),
  disabledBackground: varAlpha(grey['500Channel'], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const action = {
  light: { ...baseAction, active: grey[600] },
  dark: { ...baseAction, active: grey[400] },
};

/*
 * Light palette - Pure white background
 */
export const lightPalette = {
  mode: 'light' as const,
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  text: text.light,
  background: background.light,
  action: action.light,
  divider: varAlpha(grey['500Channel'], 0.2),
};

/*
 * Dark palette - Pure black background
 */
export const darkPalette = {
  mode: 'dark' as const,
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  text: text.dark,
  background: background.dark,
  action: action.dark,
  divider: varAlpha(grey['500Channel'], 0.2),
};
