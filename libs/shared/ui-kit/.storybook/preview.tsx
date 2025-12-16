import type { Preview } from "@storybook/react";
import { ThemeProvider } from "../src/theme/ThemeProvider";
import { Box } from "@mui/material";
import { useEffect } from "react";

const preview: Preview = {
  parameters: {
    backgrounds: {
      disable: true,
    },
  },

  globalTypes: {
    themeMode: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "dark",
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
      const mode = context.globals.themeMode || "dark";

      // Update document background to match theme
      useEffect(() => {
        const bgColor = mode === "dark" ? "#0A0E1E" : "#FFFFFF";
        const textColor = mode === "dark" ? "#FFFFFF" : "#000000";

        document.body.style.backgroundColor = bgColor;
        document.body.style.color = textColor;

        // Also update the storybook canvas
        const docs = document.querySelector('.docs-story');
        if (docs) {
          (docs as HTMLElement).style.backgroundColor = bgColor;
        }

        return () => {
          document.body.style.backgroundColor = '';
          document.body.style.color = '';
        };
      }, [mode]);

      const layout = context.parameters.layout || "padded";
      const shouldUseFullScreen = layout === "fullscreen";

      return (
        <ThemeProvider forcedMode={mode}>
          <Box
            sx={{
              minHeight: shouldUseFullScreen ? "100vh" : "auto",
              bgcolor: "background.default",
              color: "text.primary",
              p: shouldUseFullScreen ? 3 : layout === "centered" ? 4 : 2,
              display: layout === "centered" ? "flex" : "block",
              alignItems: layout === "centered" ? "center" : undefined,
              justifyContent: layout === "centered" ? "center" : undefined,
            }}
          >
            <Story />
          </Box>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
