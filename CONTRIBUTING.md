# Contributing to Composable

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm 9+
- MongoDB (local or Docker)

### Setup
```bash
git clone <repo-url>
cd composable
pnpm install
cp apps/backend/.env.example apps/backend/.env  # Edit with your values
```

### Development
```bash
# Start frontend + backend concurrently
pnpm dev

# Or individually
pnpm dev:frontend    # http://localhost:5173
pnpm dev:backend     # http://localhost:3000
pnpm dev:storybook   # Storybook UI kit

# Docker (full stack)
docker compose up
```

### Testing
```bash
pnpm --filter frontend test       # Vitest (frontend)
pnpm --filter backend test        # Jest (backend)
```

### Building
```bash
pnpm build                        # Build all packages
pnpm build:frontend               # Frontend only
pnpm build:backend                # Backend only
```

## Project Structure
```
apps/
  frontend/     React 19 + Vite + Redux Toolkit + MUI + ReactFlow
  backend/      NestJS + Mongoose + JWT/Passport
libs/
  shared/
    ui-kit/     Shared component library with Storybook
    compose/    Docker Compose type definitions
    types/      Shared TypeScript types
    utils/      Shared utility functions
    config/     Shared configuration
    validation/ Shared validation schemas
```

## PR Guidelines
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `test:`
- Ensure all tests pass before submitting
- Keep PRs focused — one feature or fix per PR
- Fill out the PR template checklist

## Code Conventions
- TypeScript strict mode
- Feature-based folder structure in frontend
- Redux Toolkit for state management (createSlice + createAsyncThunk)
- MUI components from the shared UI kit where available
