# Composable

> A modern Docker Compose builder designed for developers who want simplicity without sacrificing power.

Create production-ready stacks using templates, validate configurations in real-time, manage secrets securely, and deploy with confidence — all through an intuitive web interface.

## 🎯 Project Overview

Composable is a full-stack application that simplifies Docker Compose stack management. It provides:

- **Template-Based Stack Creation**: Pre-built templates for common architectures
- **Real-Time Validation**: Instant configuration feedback before deployment
- **Secure Secret Management**: Built-in secret handling and encryption
- **Visual Composer**: Drag-and-drop interface for building Docker Compose configurations
- **Deployment Management**: Direct deployment to Docker environments
- **Project Organization**: Manage multiple projects and their configurations

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Feature-Based Architecture](#feature-based-architecture)
- [State Management](#state-management)
- [Design Decisions](#design-decisions)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Building for Production](#building-for-production)

---

## 🏗️ Architecture Overview

Composable follows a **Feature-Based Architecture** approach combined with a **monorepo structure**. This architecture emphasizes organizing code by business capabilities (features) rather than technical layers.

### Core Principles

1. **Feature Isolation**: Each feature is self-contained with all its dependencies
2. **Single Responsibility**: Clear boundaries between features prevent unintended side effects
3. **Shared Libraries**: Common code extracted to monorepo libraries following the "Rule of Three"
4. **Micro-Frontend Ready**: Features can be extracted and reused independently

### Why Feature-Based Architecture?

**Problem with Traditional Layered Architecture:**

- Adding a single feature requires navigating through 5+ folder layers
- Code for one feature scattered across: components/, services/, api/, store/, types/
- Difficult to extract features as micro-frontends
- Premature abstraction leads to wrong abstractions (useObservable1, useObservable2, useObservable3)

**Solution with Feature-Based:**

- Everything for a feature lives in ONE folder
- New developer works in `features/resource-name/` and understands the entire feature
- Easy to extract and reuse in other applications
- Abstractions emerge naturally after implementing 3+ features

### Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                   UI Layer                          │
│     React Components, Pages, UI Logic               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                  Features Layer                     │
│  ├─ components/   (UI components)                   │
│  ├─ pages/        (Page orchestration)              │
│  ├─ hooks/        (Custom business logic)           │
│  ├─ api/          (REST API calls)                  │
│  ├─ store/        (Redux slice for feature)         │
│  ├─ types/        (TypeScript types)                │
│  └─ constants/    (Feature constants)               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                  Shared Layer                       │
│  ├─ components/   (Design system components)        │
│  ├─ hooks/        (Generic reusable hooks)          │
│  ├─ utils/        (Utility functions)               │
│  └─ types/        (Common types)                    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Redux Store (Global State)             │
│  ├─ persistence/  (Storage manager)                 │
│  ├─ middleware/   (Custom middleware)               │
│  └─ slices/       (Feature reducers)                │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│          Communication Layer                        │
│  ├─ REST API      (Backend HTTP calls)              │
│  └─ WebSocket     (Real-time updates)               │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19 with TypeScript
- **State Management**: Redux Toolkit with custom persistence middleware
- **Routing**: React Router v7
- **UI Framework**: Material-UI (MUI) with Emotion for styling
- **Form Handling**: React Hook Form with Zod validation
- **Visualization**: ReactFlow for drag-and-drop composer
- **HTTP Client**: Axios with centralized interceptors
- **Build Tool**: Vite with React plugin

### Backend

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport strategy
- **Validation**: Class-transformer & Class-validator
- **Documentation**: Swagger/OpenAPI
- **Email**: Nodemailer for mail service
- **Security**: bcrypt for password hashing

### Monorepo

- **Package Manager**: pnpm with workspaces
- **Build System**: TypeScript for type checking
- **Linting**: ESLint with strict configuration

---

## 📁 Project Structure

```
composable/
├── apps/
│   ├── backend/                    # NestJS application
│   │   ├── src/
│   │   │   ├── modules/            # Domain modules
│   │   │   │   ├── auth/
│   │   │   │   ├── mail/
│   │   │   │   └── users/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/                   # React application
│       ├── src/
│       │   ├── app/                # Core app setup
│       │   │   ├── store/          # Redux store & persistence
│       │   │   ├── layouts/        # Layout components
│       │   │   ├── router.tsx      # Route definitions
│       │   │   └── App.tsx         # Root component
│       │   │
│       │   ├── features/           # Feature modules
│       │   │   ├── auth/           # Authentication feature
│       │   │   ├── composer/       # Docker Compose builder
│       │   │   ├── dashboard/      # Dashboard feature
│       │   │   ├── home/           # Home page
│       │   │   └── projects/       # Projects management
│       │   │
│       │   ├── shared/             # Shared code
│       │   │   ├── components/     # Design system components
│       │   │   ├── hooks/          # Generic reusable hooks
│       │   │   ├── utils/          # Utility functions
│       │   │   └── types/          # Common types
│       │   │
│       │   ├── main.tsx
│       │   └── index.html
│       │
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── eslint.config.js
│
├── libs/shared/                    # Monorepo shared libraries
│   ├── ui-kit/                     # React component library
│   │   ├── src/
│   │   │   ├── components/         # Reusable UI components
│   │   │   ├── theme/              # Design system theme
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── util/                       # Utility functions library
│   │   ├── src/
│   │   │   ├── change-case.ts
│   │   │   ├── format-number.ts
│   │   │   ├── format-time.ts
│   │   │   ├── helper.ts
│   │   │   ├── storage-available.ts
│   │   │   ├── uuidv4.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── stacks/                     # Docker stack definitions & types
│   ├── services/                   # Shared services
│   ├── compose/                    # Compose-specific utilities
│   └── deployment/                 # Deployment utilities
│
├── package.json                    # Workspace root
├── pnpm-workspace.yaml             # Workspace configuration
├── tsconfig.base.json              # Base TypeScript config
└── README.md                        # This file
```

### Feature Structure Example: `features/composer/`

```
features/composer/
├── components/                     # Feature-specific components
│   ├── ComposerCanvas.tsx          # Main canvas component
│   ├── ServiceNodeEditor.tsx       # Service editor
│   └── NetworkConfigPanel.tsx
│
├── pages/                          # Page components
│   └── ComposerPage.tsx
│
├── hooks/                          # Custom feature hooks
│   ├── useComposerState.ts
│   ├── useServiceManagement.ts
│   └── useComposerValidation.ts
│
├── api/                            # Feature API calls
│   └── composerApi.ts
│
├── store/                          # Redux slice
│   ├── composerSlice.ts            # Reducers & thunks
│   └── selectors.ts                # Memoized selectors
│
├── types/                          # TypeScript types
│   ├── composer.ts
│   ├── service.ts
│   └── index.ts
│
├── constants/                      # Feature constants
│   └── defaults.ts
│
└── utils/                          # Feature utilities
    └── validation.ts
```

---

## 🎯 Feature-Based Architecture

### Design Principle: Feature Isolation

**Rule**: Features CANNOT import from other features.

```typescript
// ❌ NOT ALLOWED - Cross-feature import
import { ProjectCard } from "@/features/projects/components";

// ✅ ALLOWED - Import from shared
import { Card } from "@/shared/components";

// ✅ ALLOWED - Import within same feature
import { ServiceCard } from "../components/ServiceCard";
```

### Why This Matters

1. **Independent Development**: Multiple teams can work on different features in parallel
2. **Micro-Frontend Ready**: Extract a feature to another app without hunting down hidden dependencies
3. **Reduced Merge Conflicts**: Different features = different folders = no conflicts
4. **Explicit Boundaries**: Each feature owns its domain completely

### Enforcement

ESLint rules prevent cross-feature imports:

```javascript
// eslint.config.js
{
  "import/no-restricted-paths": {
    zones: [
      {
        target: "./src/features/composer",
        from: "./src/features/!(composer)",
        message: "Cannot import from other features in composer. Use shared/ instead."
      },
      // Repeat for each feature...
    ]
  }
}
```

### Rule of Three for Shared Code

Move code to `shared/` only when used by 3+ features.

| Code Type                                   | Location                                     | Why                  |
| ------------------------------------------- | -------------------------------------------- | -------------------- |
| ResourceCatalogCard (used only by composer) | `features/composer/components/`              | Feature-specific     |
| useResourceCatalog (used by composer only)  | `features/composer/hooks/`                   | Feature-specific     |
| Button component (used by all features)     | `shared/components/` or `@composable/ui-kit` | Used by 5+ features  |
| usePagination (used by 3+ features)         | `shared/hooks/`                              | Rule of Three met    |
| API client (used by all features)           | `shared/utils/`                              | Critical shared tool |

**Philosophy**: Duplication is cheaper than the wrong abstraction. Wait for the pattern to emerge.

---

## 🔄 State Management

### Architecture Overview

State management uses **Redux Toolkit** with three key layers:

```
┌──────────────────────────────────────────┐
│          UI Components                   │
│    (React Components reading state)      │
└────────────────┬─────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────┐
│       Redux Selectors                    │
│    (Memoized state queries)              │
└────────────────┬─────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────┐
│      Redux Store (Global State)          │
│                                          │
│  ├─ Slices (reducers & actions)          │
│  ├─ Thunks (async logic)                 │
│  └─ Middleware (side effects)            │
└────────────────┬─────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────┐
│     Persistence Middleware               │
│  (Auto-save to local/session storage)    │
└────────────────┬─────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────┐
│       Browser Storage / API              │
│  (Data persistence & server sync)        │
└──────────────────────────────────────────┘
```

### Redux Structure

Store configuration located in `app/store/`:

```typescript
// app/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistenceMiddleware, stateLoader } from "./storage";
import composerSlice from "@/features/composer/store/composerSlice";
import projectsSlice from "@/features/projects/store/projectsSlice";
import authSlice from "@/features/auth/store/authSlice";

export const store = configureStore({
  reducer: {
    composer: composerSlice,
    projects: projectsSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware),
});

// Load persisted state on app startup
await stateLoader(store);
```

### Feature Slices

Each feature manages its own slice in `features/feature-name/store/`:

```typescript
// features/composer/store/composerSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { composerApi } from "../api/composerApi";

export const fetchCompositions = createAsyncThunk(
  "composer/fetchCompositions",
  async (_, { rejectWithValue }) => {
    try {
      return await composerApi.getAll();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const composerSlice = createSlice({
  name: "composer",
  initialState: {
    compositions: [],
    selectedComposition: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectComposition: (state, action) => {
      state.selectedComposition = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompositions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompositions.fulfilled, (state, action) => {
        state.compositions = action.payload;
        state.loading = false;
      })
      .addCase(fetchCompositions.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { selectComposition } = composerSlice.actions;
export default composerSlice.reducer;
```

### Persistence Strategy

Automatically persist slices based on `storageConfig`:

```typescript
// app/store/storage/storageConfig.ts
export const storageConfig = {
  // Local Storage - survives browser closure
  auth: "local",
  projects: "local",

  // Session Storage - cleared on tab close
  composer: "session",

  // In-Memory - never persisted
  notifications: null,
};
```

**Middleware automatically**:

- ✅ Persists configured slices after each change
- ✅ Loads and hydrates state on app startup
- ✅ Validates versions and handles migrations
- ✅ Handles localStorage/sessionStorage APIs safely

### Data Flow Example

```
1. User clicks "Save Composition"
           ↓
2. Component dispatches thunk: dispatch(saveComposition(data))
           ↓
3. Thunk executes: calls composerApi.save(data)
           ↓
4. Backend updates database
           ↓
5. Redux reducer updates state: state.composer.selectedComposition = newData
           ↓
6. Persistence middleware intercepts:
   localStorage.setItem('composable_composer', JSON.stringify(state))
           ↓
7. Selector reads from store
           ↓
8. Component re-renders with new data
```

### What Goes in Redux

**✅ DO store in Redux**:

- Authentication state (user, token, permissions)
- App-wide settings (theme, language)
- Feature state that multiple pages need
- Frequently accessed data (projects, compositions)

**❌ DON'T store in Redux**:

- Form input (keep in component state or React Hook Form)
- UI state (modal open/close)
- Temporary data (filters during current session)
- Data only one component needs

---

## 🏛️ Design Decisions

### 1. Feature Isolation

**Decision**: Features cannot cross-import. All feature-specific code lives in one folder.

**Trade-offs**:

- ✅ Easy to extract features as micro-frontends
- ✅ Clear ownership boundaries
- ✅ Parallel development without conflicts
- ❌ Requires discipline to avoid temptation to import adjacent features
- ❌ Duplication until shared code emerges

### 2. Rule of Three for Abstractions

**Decision**: Only move code to `shared/` when used by 3+ features.

**Rationale**:

- First implementation: Feature-specific
- Second implementation: Duplicate (still learning pattern)
- Third implementation: Extract to shared (pattern is proven)

**Benefits**:

- ✅ Avoids premature abstraction (useObservable1, 2, 3 problem)
- ✅ Ensures shared code solves real problems
- ✅ Easier refactoring when pattern is clear
- ❌ Initial duplication seems inefficient
- ❌ Requires refactoring discipline

### 3. API Organization

**Decision**:

- Centralized Axios client in `shared/utils/api-client.ts`
- Feature-specific API modules in `features/*/api/`

```typescript
// shared/utils/api-client.ts - One instance for entire app
export const apiClient = axios.create({...});

// features/composer/api/composerApi.ts - Feature owns its endpoints
export const composerApi = {
  getAll: () => apiClient.get('/compositions'),
  save: (data) => apiClient.post('/compositions', data),
};
```

**Benefits**:

- ✅ Single authentication point
- ✅ Consistent error handling
- ✅ Easy to debug HTTP traffic
- ✅ Feature owns its API contract

### 4. Thunks for Async Logic

**Decision**: All async operations (API calls, external libraries) happen in Redux thunks.

```typescript
// Thunk owns the async flow
export const saveComposition = createAsyncThunk(
  "composer/save",
  async (data, { rejectWithValue }) => {
    try {
      // Can call multiple APIs
      // Can call external services
      // Returns new state
      return await composerApi.save(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Component just dispatches
const handleSave = () => {
  dispatch(saveComposition(formData));
};
```

**Benefits**:

- ✅ All side effects in one place
- ✅ Easy to test (mock API)
- ✅ Centralized error handling
- ✅ Type-safe with Redux Toolkit

### 5. Custom Hooks for Logic Extraction

**Decision**: Use custom hooks for complex component logic, not for state management.

```typescript
// ✅ Hook for logic extraction
export function useComposerValidation(composition) {
  return useMemo(
    () => ({
      isValid: validate(composition),
      errors: getErrors(composition),
    }),
    [composition],
  );
}

// ❌ Not for state - use Redux instead
// Don't: export function useCompositions() { return useState(...) }
```

**Benefits**:

- ✅ Testable logic
- ✅ Reusable within feature
- ✅ Composable hooks

### 6. Page Components as Orchestrators

**Decision**: Pages are thin layers that coordinate features, not business logic containers.

```typescript
// features/composer/pages/ComposerPage.tsx
export function ComposerPage() {
  // Pages coordinate, they don't compute
  const { compositions } = useSelector((state) => state.composer);
  const { useComposerLogic } = useComposerState();

  return (
    <>
      <ComposerToolbar />
      <ComposerCanvas compositions={compositions} />
      <ComposerSidebar />
    </>
  );
}
```

Benefits:

- ✅ Page structure mirrors URL structure
- ✅ Easy to understand page hierarchy
- ✅ Leaves room for layout flexibility
- ✅ Components stay focused

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v8 or higher (install with `npm install -g pnpm`)
- **MongoDB**: Local or remote instance
- **Docker**: For containerization

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd composable

# Install dependencies across all workspaces
pnpm install

# Install MongoDB (if not already installed)
# macOS:
brew tap mongodb/brew
brew install mongodb-community

# Linux:
sudo apt-get install -y mongodb

# Windows: Download from https://www.mongodb.com/try/download/community
```

### Environment Setup

Create `.env` files in each app:

```bash
# apps/backend/.env
NODE_ENV=development
PORT=3000
DB_URI=mongodb://localhost:27017/composable
JWT_SECRET=your-secret-key-here
MAIL_HOST=smtp.gmail.com
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# apps/frontend/.env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Composable
```

### Running the Application

```bash
# Start both frontend and backend
pnpm dev

# Or start individually
pnpm dev:frontend    # Frontend on http://localhost:5173
pnpm dev:backend     # Backend on http://localhost:3000

# Start Storybook (UI component library)
pnpm dev:storybook   # Storybook on http://localhost:6006
```

---

## 💻 Development Workflow

### Working on a Feature

1. **Navigate to feature folder**:

   ```bash
   cd apps/frontend/src/features/composer
   ```

2. **Add a new component**:

   ```
   components/
   ├── NewComponent.tsx
   └── NewComponent.test.tsx
   ```

3. **Update the Redux slice** (if state needed):

   ```typescript
   // features/composer/store/composerSlice.ts
   const composerSlice = createSlice({
     // Add your reducers
   });
   ```

4. **Add feature-specific types**:

   ```typescript
   // features/composer/types/index.ts
   export interface Composition { ... }
   ```

5. **Use in page**:
   ```typescript
   // features/composer/pages/ComposerPage.tsx
   import { NewComponent } from "../components/NewComponent";
   ```

### Adding a New Feature

1. **Create feature structure**:

   ```bash
   mkdir -p apps/frontend/src/features/new-feature/{components,pages,hooks,api,store,types,constants}
   ```

2. **Create Redux slice**:

   ```typescript
   // features/new-feature/store/newFeatureSlice.ts
   const newFeatureSlice = createSlice({...});
   export default newFeatureSlice.reducer;
   ```

3. **Add to Redux store**:

   ```typescript
   // app/store/store.ts
   import newFeatureSlice from "@/features/new-feature/store/newFeatureSlice";

   const store = configureStore({
     reducer: {
       newFeature: newFeatureSlice,
     },
   });
   ```

4. **Create feature API**:

   ```typescript
   // features/new-feature/api/newFeatureApi.ts
   export const newFeatureApi = {
     getAll: () => apiClient.get("/endpoint"),
   };
   ```

5. **Build components and pages normally**

### Code Style & Linting

```bash
# Run ESLint
pnpm lint

# Fix ESLint issues
pnpm lint --fix

# TypeScript type checking
pnpm build
```

### Testing

```bash
# Run tests (Backend)
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E tests
pnpm test:e2e
```

---

## 🏗️ Building for Production

### Build Frontend

```bash
# Type check and build
pnpm build:frontend

# Output: apps/frontend/dist/
```

### Build Backend

```bash
# Compile and build
pnpm build:backend

# Output: apps/backend/dist/
```

### Build All

```bash
# Build everything
pnpm build
```

### Docker Deployment

```bash
# Build Docker images
docker build -t composable-frontend:latest apps/frontend/
docker build -t composable-backend:latest apps/backend/

# Run with Docker Compose
docker-compose up -d
```

---

## 📚 Additional Resources

### Architecture References

- [Feature-Sliced Design](https://feature-sliced.design/) - Russian-origin FSD methodology
- [Bulletproof React](https://github.com/alan2207/bulletproof-react) - Production-ready React patterns
- [Kent C. Dodds - Colocation](https://kentcdodds.com/blog/colocating-component-styles) - Philosophy of colocating code
- [Uncle Bob - Screaming Architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)

### Redux Resources

- [Redux Toolkit Official Docs](https://redux-toolkit.js.org/)
- [Redux Style Guide](https://redux.js.org/style-guide/style-guide)
- [Async Thunks Guide](https://redux-toolkit.js.org/usage/usage-guide#async-thunks)

### React Resources

- [React Router v7 Docs](https://reactrouter.com/)
- [React Hook Form Docs](https://react-hook-form.com/)
- [MUI Component Library](https://mui.com/)
- [ReactFlow Documentation](https://reactflow.dev/)
