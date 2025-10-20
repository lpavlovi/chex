# Chex API

A backend API built with Hono and TypeScript.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

## Environment Variables

Copy `env.example` to `.env` and configure your environment variables.

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/hello` - Hello world endpoint

## Project Structure

```
src/
  index.ts          # Main application entry point
```
