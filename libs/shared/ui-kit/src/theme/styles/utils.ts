// ----------------------------------------------------------------------

export const stylesMode = {
  light: '[data-mui-color-scheme="light"] &',
  dark: '[data-mui-color-scheme="dark"] &',
};

export const mediaQueries = {
  upXs: "@media (min-width:0px)",
  upSm: "@media (min-width:600px)",
  upMd: "@media (min-width:900px)",
  upLg: "@media (min-width:1200px)",
  upXl: "@media (min-width:1536px)",
};

/**
 * Converts rem to px
 */
export function remToPx(value: string): number {
  return Math.round(parseFloat(value) * 16);
}

/**
 * Converts px to rem
 */
export function pxToRem(value: number): string {
  return `${value / 16}rem`;
}

/**
 * Responsive font sizes
 */
export function responsiveFontSizes({
  sm,
  md,
  lg,
}: {
  sm: number;
  md: number;
  lg: number;
}) {
  return {
    [mediaQueries.upSm]: { fontSize: pxToRem(sm) },
    [mediaQueries.upMd]: { fontSize: pxToRem(md) },
    [mediaQueries.upLg]: { fontSize: pxToRem(lg) },
  };
}

/**
 * Converts a hex color to RGB channels
 */
export function hexToRgbChannel(hex: string) {
  if (!/^#[0-9A-F]{6}$/i.test(hex)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  return `${r} ${g} ${b}`;
}

/**
 * Creates palette with channel variants
 */
export function createPaletteChannel(hexPalette: Record<string, string>) {
  const channelPalette: Record<string, string> = {};

  Object.entries(hexPalette).forEach(([key, value]) => {
    channelPalette[`${key}Channel`] = hexToRgbChannel(value);
  });

  return { ...hexPalette, ...channelPalette };
}

/**
 * Convert any supported color format to an "r g b" channel string.
 */
function toRgbChannels(input: string): string {
  const clean = input.trim();

  // #RGB
  if (/^#[0-9A-F]{3}$/i.test(clean)) {
    const r = clean[1];
    const g = clean[2];
    const b = clean[3];
    return `${parseInt(r + r, 16)} ${parseInt(g + g, 16)} ${parseInt(b + b, 16)}`;
  }

  // #RRGGBB
  if (/^#[0-9A-F]{6}$/i.test(clean)) {
    const r = parseInt(clean.slice(1, 3), 16);
    const g = parseInt(clean.slice(3, 5), 16);
    const b = parseInt(clean.slice(5, 7), 16);
    return `${r} ${g} ${b}`;
  }

  // rgb( R G B ) or rgb(R, G, B)
  const rgbFn = clean.match(/^rgb\((.*?)\)$/i);
  if (rgbFn) {
    const parts = rgbFn[1].replace(/,/g, " ").trim().split(/\s+/).map(Number);
    if (parts.length === 3) return parts.join(" ");
  }

  // plain "R G B"
  const plain = clean.match(/^(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})$/);
  if (plain) {
    const [, r, g, b] = plain;
    return `${r} ${g} ${b}`;
  }

  // CSS var -- must end with Channel
  if (clean.startsWith("var(") && clean.includes("Channel")) {
    return clean;
  }

  throw new Error(`[varAlpha] Unsupported color format: "${input}".`);
}

export function varAlpha(color: string, opacity = 1): string {
  const rgb = toRgbChannels(color);

  // If it's a CSS var, leave it
  if (rgb.startsWith("var(")) {
    return `rgba(${rgb} / ${opacity})`;
  }

  return `rgba(${rgb} / ${opacity})`;
}
