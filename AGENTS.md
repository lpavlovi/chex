# Chex Agent Guidelines

This document provides comprehensive guidelines for AI agents working on the Chex Chrome Extension codebase.

## Project Overview

**Chex** is a Chrome extension built with **SolidJS** that provides AI-powered content interaction capabilities. The project uses:
- **Monorepo structure** with pnpm workspaces
- **Manifest V3** with @crxjs/vite-plugin
- **SolidJS** for reactive UI
- **TypeScript** with strict mode
- **CSS-in-JS** via solid-styled-components

## Development Commands

### Build & Development

- `pnpm dev` - Start SPA development mode (localhost:3000)
- `pnpm build` - Build all packages for production
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Clean build artifacts

### Extension Specific

- `pnpm extension:dev` - Start extension development
- `pnpm extension:build` - Build extension for production

### Testing

- No test framework currently configured

## Architecture Patterns

### Context Provider Pattern

All context providers follow a consistent three-file structure:

1. **`entity.ts`** - Type definitions, default values, and context creation
2. **`hooks.ts`** - Custom hooks for accessing the context
3. **`provider.tsx`** - Provider component with state management

**Pattern Structure:**
```typescript
// entity.ts
export const DEFAULT_VALUE = { ... } as const;
export const Context = createContext<[Value, Actions]>([DEFAULT_VALUE, {}]);

// hooks.ts
export function useContextName() {
  return useContext(Context);
}

// provider.tsx
export function ContextProvider(props: { children?: JSX.Element }) {
  const [value, setValue] = createStore<Value>(DEFAULT_VALUE);
  const context: ContextType = [value, { /* actions */ }];
  return <Context.Provider value={context}>{props.children}</Context.Provider>;
}
```

**Current Contexts:**
- `context/state/` - Application state management (IDLE/VISUAL states)
- `context/user/` - User authentication and API key management
- `context/portal/` - Portal/DOM positioning information

### State Management

The state system uses:
- **SolidJS `createStore`** for reactive state
- **Discriminated unions** for state types (e.g., `{ name: "IDLE" } | { name: "VISUAL"; selection: any[] }`)
- **Reducer pattern** with `dispatch` function that takes `Action` objects
- **`produce` from solid-js/store** for immutable updates

**State Pattern:**
```typescript
// Define state types as discriminated unions
export type IdleState = { name: "IDLE" };
export type VisualState = { name: "VISUAL"; selection: any[] };
export type State = IdleState | VisualState;

// Actions use discriminated unions
export type Action = 
  | { type: "ACTIVATE" }
  | { type: "VISUAL_MODE" }
  | { type: "ELEMENT_SELECT"; element: DOMElement };

// Provider uses switch statement with default case
function dispatch(action: Action) {
  switch (action.type) {
    case "ACTIVATE":
      setState(IDLE_STATE);
      return;
    default:
      // Always include default case
      console.log(`Unknown action: ${action}`);
      return;
  }
}
```

### Message Types & Worker Communication

Message types use discriminated unions with `readonly` properties:

```typescript
export type WorkerMessage =
  | { readonly type: "echo"; readonly message: string }
  | { readonly type: "save_key"; readonly apiKey: string; readonly modelId: string }
  | { readonly type: "action"; readonly actions: Action[]; readonly contents: string };
```

## Code Style Guidelines

### CSS-in-JS (Strict Rule)

- ✅ **Use `css` function from solid-styled-components, NEVER `styled()`**
- Class names end with "Class" suffix (e.g., `containerClass`, `optionButtonClass`)
- CSS variables are defined outside components for reuse
- Use template literals for CSS strings

**Example:**
```typescript
const containerClass = css`
  width: 100%;
  padding: 18px 6px;
  background: linear-gradient(135deg, #212121 0%, #383838 100%);
  border-radius: 10px;
`;

function Component() {
  return <div class={containerClass}>Content</div>;
}
```

### Imports

- External libraries first, internal imports second
- Use `./` for same-directory imports
- Group SolidJS imports: `import { createSignal, onMount } from "solid-js";`
- Group store imports: `import { createStore, produce } from "solid-js/store";`
- Type imports use `import type` syntax

**Import Order:**
```typescript
// 1. External libraries
import { createSignal } from "solid-js";
import { css } from "solid-styled-components";
import { Motion } from "solid-motionone";

// 2. Internal imports
import { useUserInfo } from "../context/user/hooks";
import type { JSX } from "solid-js";
```

### TypeScript

- Use const assertions for literal types: `as const`
- Discriminated unions for message/action/state types
- Readonly properties for message interfaces
- Strict mode TypeScript enabled
- Use `type` for unions and intersections, `interface` for object shapes
- Prefer explicit return types for functions when not obvious

**Examples:**
```typescript
// Const assertions
export const ACTIONS = ["summarize", "translate", "speak"] as const;
export type ActionOption = (typeof ACTIONS)[number];

// Discriminated unions
export type State = 
  | { name: "IDLE" }
  | { name: "VISUAL"; selection: any[] };

// Readonly for messages
export type ActionMessage = {
  readonly type: "action";
  readonly actions: Action[];
  readonly contents: string;
};
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ChexCore`, `Emblem`, `StateProvider`)
- **Files**: PascalCase for components, kebab-case for utilities
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `ACTIONS`, `LANGUAGE_OPTIONS`, `IDLE_STATE`)
- **Types**: PascalCase with descriptive suffixes (e.g., `ActionOption`, `UserInfoValue`, `StateSetterType`)
- **Functions**: camelCase (e.g., `dispatch`, `useAppState`)
- **CSS Classes**: camelCase with "Class" suffix (e.g., `containerClass`, `optionButtonClass`)

### Component Patterns

- Use `createSignal` for local reactive state
- Use `createStore` for complex state objects
- Motion components with `solid-motionone` for animations
- Context providers return `[value, actions]` tuple pattern
- Use `onMount` for initialization logic

**Component Example:**
```typescript
import { createSignal } from "solid-js";
import { Motion } from "solid-motionone";
import { css } from "solid-styled-components";

const buttonClass = css`
  padding: 12px;
  background: #333;
`;

export function MyComponent() {
  const [count, setCount] = createSignal(0);
  
  return (
    <Motion.button
      class={buttonClass}
      onClick={() => setCount(count() + 1)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      Count: {count()}
    </Motion.button>
  );
}
```

### Error Handling

- Use default cases in switch statements for unknown message/action types
- Optional chaining for safe property access: `value?.property`
- Provide fallback text for processing states
- Log unknown actions/messages for debugging

**Example:**
```typescript
function dispatch(action: Action) {
  switch (action.type) {
    case "ACTIVATE":
      // handle
      return;
    default:
      console.log(`Unknown action: ${action}`);
      // Always handle default case
      return;
  }
}
```

## Chrome Extension Architecture

### Manifest V3

- Uses `@crxjs/vite-plugin` for build tooling
- Content scripts with Shadow DOM for style isolation
- Background service worker for API calls and storage
- Development mode bypasses Chrome extension context (uses `DEV_MODE=true`)

### File Structure

```
packages/extension/src/
├── background/          # Service worker (API calls, storage)
│   ├── handlers/       # Message handlers
│   ├── logic/          # Business logic
│   └── storage/        # Storage utilities
├── content/            # Content script (main UI)
│   ├── components/     # React components
│   ├── context/        # Context providers
│   └── logic/          # Content script logic
├── popup/              # Extension popup UI
└── shared/             # Shared types and utilities
    └── types/          # TypeScript type definitions
```

## Common Tasks

### Adding a New Context Provider

1. Create three files: `entity.ts`, `hooks.ts`, `provider.tsx`
2. Define types and default value in `entity.ts`
3. Create context with `createContext`
4. Export hook in `hooks.ts`
5. Implement provider with `createStore` in `provider.tsx`
6. Follow `[value, actions]` tuple pattern

### Adding a New State/Action

1. Add state type to discriminated union in `logic/state.ts`
2. Add action type to `Action` union
3. Add default state constant if needed
4. Handle action in provider's `dispatch` function
5. Use `produce` for immutable updates when modifying nested state

### Creating a New Component

1. Use PascalCase for component name
2. Define CSS classes with `css` function (not `styled()`)
3. Use `createSignal` for local state
4. Use `Motion` components for animations
5. Follow import order guidelines
6. Export component as named export

### Adding Animation

Use `solid-motionone` with `Motion` components:

```typescript
<Motion.div
  initial={{ opacity: 0, scale: 0.8, x: 80 }}
  animate={{ opacity: 1, scale: 1, x: 0 }}
  exit={{ opacity: 0, scale: 0.8, x: 80 }}
  transition={{ duration: 0.2, easing: "ease-out" }}
>
  Content
</Motion.div>
```

## Best Practices

1. **Always use discriminated unions** for state, actions, and messages
2. **Include default cases** in switch statements
3. **Use `produce`** for immutable state updates
4. **Follow the three-file pattern** for contexts (entity, hooks, provider)
5. **Use `readonly` properties** for message types
6. **Keep CSS classes outside components** when possible
7. **Use const assertions** for literal type inference
8. **Group imports** by external/internal, then alphabetically
9. **Prefer `type` over `interface`** for unions
10. **Log unknown actions/messages** in default cases for debugging

## Dependencies

### Key Libraries

- `solid-js` - Core reactive framework
- `solid-js/store` - State management (`createStore`, `produce`)
- `solid-styled-components` - CSS-in-JS (`css` function)
- `solid-motionone` - Animations (`Motion` components)
- `@crxjs/vite-plugin` - Chrome extension build tooling
- `@google/genai` - Google AI SDK

### Node Requirements

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (package manager: pnpm@9.0.0)
