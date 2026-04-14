# Copilot Instructions

## Build, Test, and Lint

This is a pnpm monorepo with workspaces in `apps/*` and `libs/shared/*`.

```bash
pnpm install                # Install all dependencies
pnpm dev                    # Run frontend + backend concurrently
pnpm dev:frontend           # Frontend only (Vite, port 5173)
pnpm dev:backend            # Backend only (NestJS, port 3000)
pnpm dev:storybook          # UI kit Storybook (port 6006)
pnpm build                  # Build all packages
pnpm build:frontend         # Type check (tsc) + Vite build
pnpm build:backend          # NestJS build
```

### Backend testing and linting

```bash
cd apps/backend
pnpm test                   # Run all tests (Jest)
pnpm test -- --testPathPattern=auth   # Run tests matching "auth"
pnpm test:watch             # Watch mode
pnpm test:cov               # Coverage
pnpm test:e2e               # E2E tests (jest-e2e.json config)
pnpm lint                   # ESLint + Prettier (auto-fix)
pnpm format                 # Prettier only
```

Test files use `*.spec.ts` suffix and live alongside source files.

### Frontend linting

```bash
cd apps/frontend
pnpm lint                   # ESLint
```

## Architecture

Composable is a Docker Compose builder — a web app for creating, validating, and deploying Docker Compose stacks through a visual interface.

### Monorepo layout

- **`apps/frontend`** — React 19, Vite, Redux Toolkit, MUI, React Router v7
- **`apps/backend`** — NestJS 11, MongoDB/Mongoose, JWT auth (Passport), Swagger at `/api/docs`
- **`libs/shared/*`** — Six shared TypeScript packages: `ui-kit`, `util`, `stacks`, `services`, `compose`, `deployment`

Shared packages are referenced via `@composable/*` path aliases defined in `tsconfig.base.json`.

### Frontend: feature-based architecture

Code is organized by business feature, not by technical layer:

```
src/
├── app/          # Store, router, layouts, typed Redux hooks
├── features/     # Self-contained feature modules
│   ├── auth/     # pages/, components/, store/, types/, constants/
│   ├── composer/
│   ├── dashboard/
│   ├── home/
│   └── projects/
└── shared/       # Components and utils used across 3+ features
```

Each feature contains its own `pages/`, `components/`, `store/` (Redux slice), `hooks/`, `api/`, `types/`, and `constants/` subdirectories as needed.

### Backend: NestJS modules

```
src/
├── app.module.ts       # Root module
└── modules/
    ├── auth/           # JWT auth, RBAC guards, OTP email verification
    ├── users/          # User schema + service
    └── mail/           # Nodemailer service
```

Each module follows the NestJS pattern: `*.module.ts`, `*.service.ts`, `*.controller.ts`, with `dto/`, `guards/`, `strategies/`, and `decorators/` subdirectories.

## Key Conventions

### Feature isolation (frontend)

Features **cannot** import from other features. This is enforced by ESLint `import/no-restricted-paths` rules.

```typescript
// ❌ Cross-feature import — not allowed
import { ProjectCard } from '@/features/projects/components';

// ✅ Import from shared
import { Card } from '@/shared/components';

// ✅ Import within same feature
import { ServiceCard } from '../components/ServiceCard';
```

### Rule of Three for shared code

Code stays in the feature until it's used by 3+ features, then extract to `shared/` or a `@composable/*` library. Prefer duplication over premature abstraction.

### State management

- **Redux Toolkit** for all cross-page/feature state (auth, projects, compositions)
- Each feature owns its slice in `features/<name>/store/<name>Slice.ts`
- Async operations use `createAsyncThunk` — all side effects live in thunks, not components
- Custom persistence middleware auto-saves slices to localStorage/sessionStorage based on `storageConfig`
- Use `useAppDispatch` and `useAppSelector` from `@app/hooks` (not raw `useDispatch`/`useSelector`)
- **Don't** store form state, UI-only state, or single-component data in Redux

### API pattern

- Centralized Axios client in `shared/utils/api-client.ts` with auth interceptors
- Feature-specific API modules in `features/<name>/api/<name>Api.ts` that wrap the shared client

### Frontend import aliases

```
@         → src/
@features → src/features/
@shared   → src/shared/
@app      → src/app/
```

### Backend conventions

- Validation via `class-validator` decorators on DTOs with global `ValidationPipe` (whitelist mode)
- Configuration through `@nestjs/config` (`ConfigService.get<Type>('KEY')`)
- Auth: JWT access tokens (15m default) + refresh tokens; `@Roles('ADMIN')` decorator for RBAC
- Prettier: single quotes, trailing commas (`apps/backend/.prettierrc`)

### Adding a new frontend feature

1. Create the directory structure: `features/<name>/{components,pages,hooks,api,store,types,constants}`
2. Create a Redux slice and register it in `app/store.ts`
3. Add routes in `app/router.tsx`
4. Wrap authenticated routes with `ProtectedRoute`

### Adding a new backend module

1. Create `modules/<name>/` with `*.module.ts`, `*.service.ts`, `*.controller.ts`
2. Add DTOs in `dto/` with `class-validator` decorators
3. Import the module in `app.module.ts`

### Environment variables

```bash
# apps/backend/.env
MONGODB_URI=mongodb://localhost:27017/composable
PORT=3000
JWT_ACCESS_SECRET=<secret>
JWT_ACCESS_EXPIRES_IN=15m
FRONTEND_URL=http://localhost:5173    # CORS origin

# apps/frontend/.env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Composable
```
