# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Composable** is a visual Docker Compose stack builder built as a **pnpm workspace monorepo**. It allows users to drag and drop components to visually design Docker Compose stacks, then generates YAML files and handles deployment.

**Tech Stack:**
- **Frontend**: React + Vite + TypeScript + Redux Toolkit (drag-and-drop canvas for stack design)
- **Backend**: NestJS + TypeScript (YAML generation and deployment orchestration)
- **Shared Libraries**: Domain-specific modules and a custom UI kit with Storybook

The project follows a domain-driven design with shared libraries for Docker Compose stack management.

## Architecture

### Monorepo Structure

```
composable/
├── apps/
│   ├── frontend/          # React application (visual stack builder)
│   └── backend/           # NestJS API (YAML generation & deployment)
└── libs/
    └── shared/
        ├── ui-kit/        # MUI-based component library with Storybook
        ├── stacks/        # Docker stack management logic
        ├── services/      # Docker service/container logic
        ├── compose/       # Docker Compose YAML generation
        ├── deployment/    # Deployment orchestration logic
        └── util/          # Shared utilities
```

### Workspace Configuration

- Uses **pnpm workspaces** defined in `pnpm-workspace.yaml`
- Shared libraries are referenced via workspace protocol: `workspace:*`
- Path aliases configured in `tsconfig.base.json` (e.g., `@composable/ui-kit`, `@composable/shared-stacks`)

### UI Kit Architecture

The UI kit (`libs/shared/ui-kit`) is a critical shared library with:

#### Theme System
- **Dark mode by default** - The app defaults to dark theme (`#0A0E1E` background, `#6366F1` primary blue)
- MUI theme with custom overrides in `src/theme/core/`:
  - `colors.json` - Color palette (primary: `#6366F1`, dark background: `#0A0E1E`)
  - `palette.ts` - MUI palette configuration
  - `components/` - 32 MUI component overrides (button, card, textfield, etc.)
  - `shadows.ts` & `custom-shadows.ts` - Shadow system
  - `typography.ts` - Typography configuration
- `ThemeProvider.tsx` supports both user-controlled and forced mode (for Storybook)
- Theme mode persisted in localStorage

#### Storybook Configuration
- Configured for dark mode by default
- Uses custom decorator in `.storybook/preview.tsx` that:
  - Sets default theme to "dark"
  - Updates document background based on theme mode
  - Wraps stories in themed `Box` component
  - Respects layout parameters (centered, padded, fullscreen)
- `.storybook/manager.ts` sets Storybook UI to dark theme
- `.storybook/preview-head.html` contains CSS overrides for proper dark mode rendering

#### Component Organization
Components are organized by category in Storybook:
- `Components/Form` - Form inputs (TextField, Checkbox, Radio, Select, Switch, Slider)
- `Components/Navigation` - Navigation (CustomBreadcrumbs, CustomTabs)
- `Components/Feedback` - Feedback (Snackbar, EmptyContent, ProgressBar, LoadingScreen, ConfirmDialog)
- `Components/Data Display` - Data display (Chart, Filters, Table)
- `Components/Display` - General display (Label, Iconify)
- `Components/Utils` - Utilities (CustomPopover)
- `Components/Button` - Button variants
- `Components/Card` - Card component

#### Key Components
- **Snackbar**: Uses Sonner library, styled to match theme with inverted colors for default toasts
- **Icons**: Uses Iconify with Solar icon set
- **Charts**: ApexCharts integration
- **Scrollbar**: SimpleBar integration
- **Progress**: NProgress integration

## Development Commands

### Root Level Commands

```bash
# Development
pnpm dev                   # Run both frontend and backend concurrently
pnpm dev:frontend          # Run frontend only (Vite dev server)
pnpm dev:backend           # Run backend only (NestJS watch mode)
pnpm dev:storybook         # Run Storybook on port 6006

# Build
pnpm build                 # Build all packages
pnpm build:frontend        # Build frontend only
pnpm build:backend         # Build backend only
```

### Frontend Commands (apps/frontend)

```bash
pnpm --filter frontend dev      # Start dev server
pnpm --filter frontend build    # Build for production
pnpm --filter frontend lint     # Run ESLint
pnpm --filter frontend preview  # Preview production build
```

### Backend Commands (apps/backend)

```bash
pnpm --filter backend start:dev    # Start with watch mode
pnpm --filter backend start:debug  # Start with debugger
pnpm --filter backend build        # Build
pnpm --filter backend test         # Run Jest tests
pnpm --filter backend test:watch   # Run tests in watch mode
pnpm --filter backend test:cov     # Run tests with coverage
pnpm --filter backend test:e2e     # Run e2e tests
pnpm --filter backend lint         # Run ESLint with auto-fix
```

### UI Kit Commands (libs/shared/ui-kit)

```bash
pnpm --filter @composable/ui-kit storybook         # Start Storybook dev server
pnpm --filter @composable/ui-kit build-storybook   # Build Storybook for production
```

### Shared Library Commands

```bash
pnpm --filter @composable/shared-stacks build      # Build stacks library
pnpm --filter @composable/shared-services build    # Build services library
pnpm --filter @composable/shared-compose build     # Build compose library
pnpm --filter @composable/shared-deployment build  # Build deployment library
# Similar pattern for other shared libraries
```

## Theme Customization Guidelines

When modifying the UI kit theme:

1. **Colors**: Edit `libs/shared/ui-kit/src/theme/core/colors.json`
2. **Component Styles**: Add/modify files in `libs/shared/ui-kit/src/theme/core/components/`
   - Each component has its own file (e.g., `button.tsx`, `card.tsx`)
   - Export from `components/index.ts`
   - Components use MUI's `Components` type for type safety
3. **Dark Mode**: The default mode is "dark" - ensure all component overrides support both light and dark modes using `theme.palette.mode`
4. **Shadows**: Use `theme.customShadows` for consistent shadows across components

## Storybook Story Structure

When creating new component stories:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta = {
  title: 'Components/Category/ComponentName',  // Categorized path
  component: ComponentName,
  parameters: {
    layout: 'centered',  // or 'padded' or 'fullscreen'
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;
```

Story categories follow the pattern: `Components/{Category}/{ComponentName}`

## Important Patterns

### Workspace Dependencies
When a shared library needs to be used:
1. Add to `package.json` dependencies: `"@composable/shared-xxx": "workspace:*"`
2. Import using the alias: `import { something } from '@composable/shared-xxx'`

### Theme Provider Usage
Components can access theme mode via:
```typescript
import { useThemeMode } from '@composable/ui-kit/theme';

const { mode, toggleTheme } = useThemeMode();
```

### Forced Theme Mode (Storybook)
ThemeProvider accepts `forcedMode` prop to override user preferences:
```typescript
<ThemeProvider forcedMode="dark">
  {children}
</ThemeProvider>
```

## Technology Stack

- **Frontend**: React 19, Redux Toolkit, React Router, React Hook Form, Zod, Axios
- **Backend**: NestJS 11, TypeScript
- **UI**: MUI 7, Emotion, Iconify, ApexCharts, Sonner, SimpleBar, NProgress
- **Build**: Vite 7, TypeScript 5.9+
- **Testing**: Jest (backend), Storybook (UI components)
- **Package Manager**: pnpm with workspaces
