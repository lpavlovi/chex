# Chex Chrome Extension - Architecture Summary

## Overview

Chex is a Chrome extension built with **SolidJS** that provides AI-powered content interaction capabilities (summarize, translate, speak) on web pages. The project uses a **monorepo structure** with pnpm workspaces and includes a special development mode that renders the app as an SPA for faster local development.

## Project Structure

### Monorepo Packages

- **`packages/extension/`** - Main Chrome extension package
  - Content scripts (injected into web pages)
  - Background service worker
  - Popup UI
  - Development mode entry point

- **`packages/api/`** - Backend API server (Hono.js)
  - Provides AI utility endpoints (e.g., `/api/summary`)
  - Runs on port 3001 by default

- **`packages/shared/`** - Shared TypeScript types and utilities
  - Message types for communication between extension components
  - Shared constants and types

## Development Modes

### 1. Extension Mode (Production)
- Entry: `packages/extension/src/content/main.ts`
- Mounts app in **Shadow DOM** for style isolation
- Only mounts when `chrome.runtime.id` is available (extension context)
- Content script injected via manifest on `https://*/*` pages

### 2. Development Mode (SPA)
- Entry: `packages/extension/src/dev-main.ts`
- Entry HTML: `packages/extension/dev.html`
- Runs as standalone SPA on `http://localhost:3000`
- Enables hot module replacement (HMR) for faster development
- Mounts directly to `document.body` (no shadow DOM)
- Activated with `DEV_MODE=true` environment variable

### Build Configuration

- **Vite** is used as the build tool
- **`@crxjs/vite-plugin`** for Chrome extension bundling (disabled in dev mode)
- **`vite-plugin-solid`** for SolidJS support with HMR
- Dev mode: `pnpm dev` (sets `DEV_MODE=true`)
- Extension dev: `pnpm dev:extension` (uses crx plugin)
- Production: `pnpm build` (creates zip in `release/` folder)

## Core Architecture

### Content Script (`App.tsx`)

The main content script UI component:

- **Activation**: Toggle with `Cmd+K` (Mac) or `Ctrl+K` (Windows)
- **Position**: Fixed at top-right (20px from edges)
- **Animations**: Uses `solid-motionone` for enter/exit animations
- **Context Providers**:
  - `UserProvider` - Manages user authentication and API key state
  - `PortalProvider` - Manages element highlighting/outlining on the page

### Key Components

1. **`ChexCore`** - Main interaction UI (currently shows action buttons)
2. **`Emblem`** - Branding/logo component
3. **`PortalProvider`** - Renders SVG outlines around selected DOM elements
   - Generates rounded rectangle paths with animated dashed borders
   - Used for highlighting elements on the page

### State Management

- **User Context** (`context/user/`)
  - Stores API key and login status
  - Provides `useUserInfo()` hook
  - Currently hardcoded in dev (sets API key to "abcdefg")

- **Portal Context** (`context/portal/`)
  - Manages selected element highlighting
  - Stores `DOMRect` for the highlighted element
  - Renders animated SVG outline overlay

### Background Service Worker

Located in `packages/extension/src/background/index.ts`:

- Handles messages from content scripts and popup
- Message types:
  - `echo` - Test message
  - `save_key` - Save API key to storage
  - `google_login` - OAuth authentication
  - `action` - Execute AI actions (summarize, translate, speak)
  - `logout` - Clear user session

### Communication Pattern

- **Worker Dispatcher** (`shared/worker_dispatcher.ts`)
  - Abstracts communication with background worker
  - Uses `chrome.runtime.sendMessage()` in extension mode
  - Falls back to service worker dispatcher in dev mode (not fully implemented)

### Message Types

Defined in `packages/extension/src/shared/types/message.ts`:

- `ActionMessage` - Contains actions array and content to process
- `SaveKeyMessage` - API key and model ID
- `GoogleLoginMessage` - OAuth login request
- `EchoMessage` - Test/debug message
- `LogoutMessage` - Session cleanup

Actions supported:
- `summarize` - Summarize text content
- `translate` - Translate to specified language
- `speak` - Text-to-speech with language option

## Styling

- **`solid-styled-components`** for CSS-in-JS
- CSS extracted and injected into shadow DOM (extension) or `<head>` (dev mode)
- Uses `extractCss()` utility for style extraction

## Key Features

1. **Shadow DOM Isolation** - Content script styles don't leak to host page
2. **Hot Module Replacement** - Fast development iteration
3. **Motion Animations** - Smooth enter/exit transitions
4. **Element Highlighting** - Visual feedback for selected page elements
5. **Cross-platform Keyboard Shortcuts** - Detects macOS vs Windows/Linux
6. **Google OAuth** - User authentication (configured in manifest)

## Development Workflow

1. **Local Development**: Run `pnpm dev` → Opens SPA at `localhost:3000`
   - Edit components with instant HMR
   - Test keyboard shortcuts (`Cmd/Ctrl+K`)
   - No need to reload extension

2. **Extension Testing**: Run `pnpm dev:extension` → Builds extension
   - Load unpacked extension in Chrome
   - Test on actual web pages
   - Full extension context available

3. **Production Build**: Run `pnpm build` → Creates zip file
   - Output: `packages/extension/release/crx-chex-0.1.zip`

## Manifest Configuration

- **Manifest V3** extension
- Content scripts on `https://*/*`
- Permissions: `activeTab`, `contentSettings`, `storage`, `identity`
- OAuth2 client ID configured for Google login
- Service worker: `src/background/index.ts`
- Popup: `index.html` (for API key submission)

## Important Notes

- The extension uses **Shadow DOM** in production but **regular DOM** in dev mode
- CSS extraction must happen after component render
- The app only mounts when Chrome extension context is detected (production)
- Dev mode bypasses extension checks for faster iteration
- User state is currently hardcoded in `UserProvider` (dev/testing)

