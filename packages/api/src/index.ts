import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import dotenv from "dotenv";
import { summarize } from "./ai/utils";

// Load environment variables
dotenv.config();

const app = new Hono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Add your frontend URLs
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "chex-api",
  });
});

// API routes
app.get("/api/hello", (c) => {
  return c.json({
    message: "Hello from Chex API!",
    version: "0.0.0",
  });
});

// API LLM utility routes
// POST /api/summary
// Accepts a JSON with a field "textContent"
// prints to console
app.post("/api/summary", async (c) => {
  try {
    const body = await c.req.json();
    const textContent = body["text_content"];

    if (!textContent) {
      return c.json({ error: "Missing 'text_content' field" }, 400);
    }

    const textContentSummary = await summarize(textContent);

    return c.json({
      success: true,
      message: textContentSummary,
    });
  } catch (error) {
    console.error("Error processing summary request:", error);
    return c.json({ error: "Invalid JSON body" }, 400);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("API Error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

const port = process.env.PORT || 3001;

console.log(`server starting on port ${port}`);

serve({
  fetch: app.fetch,
  port: Number(port),
});
