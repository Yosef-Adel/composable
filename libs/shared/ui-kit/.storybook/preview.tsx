import type { Preview } from "@storybook/react";
import { ThemeProvider } from "../src/theme/ThemeProvider";

const preview: Preview = {
  globalTypes: {
    themeMode: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "contrast",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const mode = context.globals.themeMode;

      return (
        <ThemeProvider forcedMode={mode}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
