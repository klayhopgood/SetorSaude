import express from "express";

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

try {
  const { registerRoutes } = await import("../server/routes");
  registerRoutes(app);
} catch (err: any) {
  console.error("Failed to register routes:", err);
  // If routes fail to load, add a fallback error handler
  app.all("/api/*", (_req, res) => {
    res.status(500).json({
      error: "Server initialization failed",
      message: err?.message || "Unknown error",
    });
  });
}

export default app;
