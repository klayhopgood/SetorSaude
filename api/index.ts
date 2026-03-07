import express from "express";
import { registerRoutes } from "../server/routes.js";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

// Debug endpoint that doesn't depend on DB
app.get("/api/debug", (_req, res) => {
  res.json({
    status: "ok",
    hasDbUrl: !!process.env.DATABASE_URL,
    hasAdminPw: !!process.env.ADMIN_PASSWORD,
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
  });
});

// registerRoutes returns an http.Server but we only need the Express app for Vercel
registerRoutes(app);

export default app;
