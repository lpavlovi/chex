import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'chex-api'
  });
});

// API routes
app.get('/api/hello', (c) => {
  return c.json({ 
    message: 'Hello from Chex API!',
    version: '0.0.0'
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

const port = process.env.PORT || 3001;

console.log(`🚀 Chex API server starting on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
