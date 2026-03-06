import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  specialists,
  specialistSchedules,
  services,
  serviceSchedules,
  siteSettings,
  uploadedImages,
  insertSpecialistSchema,
  insertSpecialistScheduleSchema,
  insertServiceSchema,
  insertServiceScheduleSchema,
} from "@shared/schema";

// ── Admin auth middleware ─────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "duarteisking";

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export function registerRoutes(app: Express): Server {
  // ══════════════════════════════════════════════════════════════════
  // PUBLIC API ROUTES
  // ══════════════════════════════════════════════════════════════════

  // ── Specialists + their schedules ──────────────────────────────
  app.get("/api/specialists", async (_req, res) => {
    try {
      const allSpecialists = await db
        .select()
        .from(specialists)
        .orderBy(specialists.sortOrder);

      const allSchedules = await db.select().from(specialistSchedules);

      const result = allSpecialists.map((s) => ({
        ...s,
        schedules: allSchedules.filter((sc) => sc.specialistId === s.id),
      }));

      res.json(result);
    } catch (error) {
      console.error("Failed to fetch specialists:", error);
      res.status(500).json({ error: "Failed to fetch specialists" });
    }
  });

  // ── Services + their schedules ─────────────────────────────────
  app.get("/api/services", async (_req, res) => {
    try {
      const allServices = await db
        .select()
        .from(services)
        .orderBy(services.sortOrder);

      const allSchedules = await db.select().from(serviceSchedules);

      const result = allServices.map((s) => ({
        ...s,
        schedules: allSchedules.filter((sc) => sc.serviceId === s.id),
      }));

      res.json(result);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // ── Site Settings ──────────────────────────────────────────────
  app.get("/api/settings", async (_req, res) => {
    try {
      const allSettings = await db.select().from(siteSettings);
      const settingsMap: Record<
        string,
        { valueEn: string | null; valuePt: string | null }
      > = {};
      allSettings.forEach((s) => {
        settingsMap[s.key] = { valueEn: s.valueEn, valuePt: s.valuePt };
      });
      res.json(settingsMap);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // ── Serve uploaded images ──────────────────────────────────────
  app.get("/api/images/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).send("Invalid ID");

      const [image] = await db
        .select()
        .from(uploadedImages)
        .where(eq(uploadedImages.id, id));

      if (!image) return res.status(404).send("Not found");

      const buffer = Buffer.from(image.data, "base64");
      res.set("Content-Type", image.contentType);
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      res.send(buffer);
    } catch (error) {
      console.error("Failed to serve image:", error);
      res.status(500).send("Error");
    }
  });

  // ── Health check ───────────────────────────────────────────────
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ══════════════════════════════════════════════════════════════════
  // ADMIN API ROUTES (password-protected)
  // ══════════════════════════════════════════════════════════════════

  // ── Auth check ─────────────────────────────────────────────────
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  // ── Image upload ───────────────────────────────────────────────
  app.post("/api/admin/upload-image", adminAuth, async (req, res) => {
    try {
      const { filename, contentType, data } = req.body;
      if (!filename || !contentType || !data) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const [result] = await db
        .insert(uploadedImages)
        .values({ filename, contentType, data })
        .returning();

      res.json({ id: result.id, url: `/api/images/${result.id}` });
    } catch (error) {
      console.error("Failed to upload image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // ── CRUD Specialists ───────────────────────────────────────────
  app.post("/api/admin/specialists", adminAuth, async (req, res) => {
    try {
      const data = insertSpecialistSchema.parse(req.body);
      const [result] = await db.insert(specialists).values(data).returning();
      res.json(result);
    } catch (error) {
      console.error("Failed to create specialist:", error);
      res.status(400).json({ error: "Invalid data" });
    }
  });

  app.put("/api/admin/specialists/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertSpecialistSchema.partial().parse(req.body);
      const [result] = await db
        .update(specialists)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(specialists.id, id))
        .returning();
      res.json(result);
    } catch (error) {
      console.error("Failed to update specialist:", error);
      res.status(400).json({ error: "Invalid data" });
    }
  });

  app.delete("/api/admin/specialists/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(specialists).where(eq(specialists.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete specialist:", error);
      res.status(500).json({ error: "Failed to delete" });
    }
  });

  // ── CRUD Specialist Schedules ──────────────────────────────────
  app.post(
    "/api/admin/specialist-schedules",
    adminAuth,
    async (req, res) => {
      try {
        const data = insertSpecialistScheduleSchema.parse(req.body);
        const [result] = await db
          .insert(specialistSchedules)
          .values(data)
          .returning();
        res.json(result);
      } catch (error) {
        console.error("Failed to create schedule:", error);
        res.status(400).json({ error: "Invalid data" });
      }
    },
  );

  app.delete(
    "/api/admin/specialist-schedules/:id",
    adminAuth,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await db
          .delete(specialistSchedules)
          .where(eq(specialistSchedules.id, id));
        res.json({ success: true });
      } catch (error) {
        console.error("Failed to delete schedule:", error);
        res.status(500).json({ error: "Failed to delete" });
      }
    },
  );

  // ── CRUD Services ──────────────────────────────────────────────
  app.post("/api/admin/services", adminAuth, async (req, res) => {
    try {
      const data = insertServiceSchema.parse(req.body);
      const [result] = await db.insert(services).values(data).returning();
      res.json(result);
    } catch (error) {
      console.error("Failed to create service:", error);
      res.status(400).json({ error: "Invalid data" });
    }
  });

  app.put("/api/admin/services/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertServiceSchema.partial().parse(req.body);
      const [result] = await db
        .update(services)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(services.id, id))
        .returning();
      res.json(result);
    } catch (error) {
      console.error("Failed to update service:", error);
      res.status(400).json({ error: "Invalid data" });
    }
  });

  app.delete("/api/admin/services/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(services).where(eq(services.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete service:", error);
      res.status(500).json({ error: "Failed to delete" });
    }
  });

  // ── CRUD Service Schedules ─────────────────────────────────────
  app.post("/api/admin/service-schedules", adminAuth, async (req, res) => {
    try {
      const data = insertServiceScheduleSchema.parse(req.body);
      const [result] = await db
        .insert(serviceSchedules)
        .values(data)
        .returning();
      res.json(result);
    } catch (error) {
      console.error("Failed to create service schedule:", error);
      res.status(400).json({ error: "Invalid data" });
    }
  });

  app.delete(
    "/api/admin/service-schedules/:id",
    adminAuth,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await db
          .delete(serviceSchedules)
          .where(eq(serviceSchedules.id, id));
        res.json({ success: true });
      } catch (error) {
        console.error("Failed to delete service schedule:", error);
        res.status(500).json({ error: "Failed to delete" });
      }
    },
  );

  // ── CRUD Site Settings ─────────────────────────────────────────
  app.get("/api/admin/settings", adminAuth, async (_req, res) => {
    try {
      const allSettings = await db.select().from(siteSettings);
      res.json(allSettings);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings/:key", adminAuth, async (req, res) => {
    try {
      const { key } = req.params;
      const { valueEn, valuePt } = req.body;

      // Upsert: update if exists, insert if not
      const existing = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key));

      if (existing.length > 0) {
        const [result] = await db
          .update(siteSettings)
          .set({ valueEn, valuePt, updatedAt: new Date() })
          .where(eq(siteSettings.key, key))
          .returning();
        res.json(result);
      } else {
        const [result] = await db
          .insert(siteSettings)
          .values({ key, valueEn, valuePt })
          .returning();
        res.json(result);
      }
    } catch (error) {
      console.error("Failed to update setting:", error);
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
