# Component Function Scope Best Practice

## Reference Implementation
See: `/Users/luka/workspace/chex/packages/extension/src/content/components/VisualMode.tsx`

## Rule: Event Handler Function Declaration

### 🎯 **Correct Pattern: Declare Functions Within Component Scope**

When creating components that need event handlers accessible to multiple lifecycle hooks, follow this pattern:

```typescript
export function ComponentName() {
  // 1. Get state/context first
  const [state, dispatch] = useSomeHook();
  const [portalInfo, setPortalInfo] = useAnotherHook();

  // 2. Declare event handler functions within component scope
  function handleEvent(event: Event) {
    // Handler logic with access to component state
    if (state.name !== "TARGET_STATE") return;

    // Access to dispatch and other component variables
    dispatch({ type: "SOME_ACTION" });
    setPortalInfo(someValue);
  }

  // 3. Use declared functions in lifecycle hooks
  onMount(() => {
    document.addEventListener("click", handleEvent, true);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleEvent, true);
  });

  // 4. Return component JSX
  return <div>Content</div>;
}
```

### ❌ **Incorrect Pattern: Nested Function Declarations**

```typescript
export function ComponentName() {
  // ❌ Avoid: Nested function declarations limit scope access
  onMount(() => {
    const handleEvent = (event: Event) => {
      // Cannot be accessed by onCleanup
    };
    document.addEventListener("click", handleEvent, true);
  });

  onCleanup(() => {
    // ❌ Error: handleEvent is not defined here
    document.removeEventListener("click", handleEvent, true);
  });
}
```

## 📋 **Key Principles**

### 1. **Order of Operations**
- **Step 1**: Import dependencies
- **Step 2**: Get state/context hooks
- **Step 3**: Declare event handler functions
- **Step 4**: Define lifecycle hooks
- **Step 5**: Return JSX

### 2. **Scope Access**
- Event handlers declared within component function have **closure access** to:
  - All state variables from hooks
  - Dispatch functions
  - Setters from context providers
  - Other component variables and functions

### 3. **Lifecycle Integration**
- Declare functions **before** lifecycle hooks that use them
- Ensure `onMount` and `onCleanup` can reference the same function
- Use function name consistently across all lifecycle calls

### 4. **Event Listener Management**
- Always use the **same function reference** for adding and removing listeners
- This ensures proper cleanup and prevents memory leaks
- Use capture phase (`true`) when needed to intercept events before target

## 🔧 **Implementation Details**

### Type Safety
```typescript
// Always type event parameters
function handleElementClick(event: MouseEvent) {
  // TypeScript provides event methods and properties
  event.preventDefault();
  event.stopPropagation();
}
```

### State Checking
```typescript
// Always verify current state before processing
if (state.name !== "VISUAL") return;
```

### Action Dispatching
```typescript
// Use discriminated unions for type-safe actions
dispatch({ type: "ELEMENT_SELECT", element: element });
```

## 🚫 **Common Mistakes to Avoid**

1. **Function re-declaration**: Don't create new functions in every render
2. **Scope violations**: Don't declare functions outside component scope
3. **Missing cleanup**: Always remove event listeners in `onCleanup`
4. **Type mismatches**: Always type event parameters correctly
5. **State validation**: Always check current state before processing events

## 📝 **When to Use This Pattern**

This pattern is essential for:
- Components with lifecycle-managed event listeners
- Event handlers that need access to component state
- Components that add/remove event listeners dynamically
- Any component requiring shared functions across lifecycle methods

## 🔄 **Related Best Practices**

- **CSS-in-JS**: Always use `css` function, never `styled()`
- **Context hooks**: Import from `context/*/hooks.ts`
- **Component naming**: Use PascalCase for components
- **Function naming**: Use descriptive names like `handleElementClick`
- **Lifecycle separation**: Keep `onMount` for setup, `onCleanup` for teardown

---

This pattern ensures clean, maintainable code that properly manages event listeners while maintaining access to component state and lifecycle management.