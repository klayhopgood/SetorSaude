import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

// registerRoutes returns an http.Server but we only need the Express app for Vercel
registerRoutes(app);

export default app;
