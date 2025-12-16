declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      z1: string;
      z8: string;
      z12: string;
      z16: string;
      z20: string;
      z24: string;
      card: string;
      dropdown: string;
      dialog: string;
      primary: string;
      secondary: string;
      info: string;
      success: string;
      warning: string;
      error: string;
    };
  }

  interface ThemeOptions {
    customShadows?: {
      z1: string;
      z8: string;
      z12: string;
      z16: string;
      z20: string;
      z24: string;
      card: string;
      dropdown: string;
      dialog: string;
      primary: string;
      secondary: string;
      info: string;
      success: string;
      warning: string;
      error: string;
    };
  }

  interface PaletteColor {
    lighter?: string;
    darker?: string;
    lighterChannel?: string;
    darkerChannel?: string;
    mainChannel?: string;
    lightChannel?: string;
    darkChannel?: string;
    contrastTextChannel?: string;
  }

  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
    lighterChannel?: string;
    darkerChannel?: string;
    mainChannel?: string;
    lightChannel?: string;
    darkChannel?: string;
    contrastTextChannel?: string;
  }
}

declare module '@mui/material' {
  interface Color {
    ['50Channel']: string;
    ['100Channel']: string;
    ['200Channel']: string;
    ['300Channel']: string;
    ['400Channel']: string;
    ['500Channel']: string;
    ['600Channel']: string;
    ['700Channel']: string;
    ['800Channel']: string;
    ['900Channel']: string;
  }
}

export {};
