var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/api-entry.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";

// server/db.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertServiceScheduleSchema: () => insertServiceScheduleSchema,
  insertServiceSchema: () => insertServiceSchema,
  insertSiteSettingSchema: () => insertSiteSettingSchema,
  insertSpecialistScheduleSchema: () => insertSpecialistScheduleSchema,
  insertSpecialistSchema: () => insertSpecialistSchema,
  serviceSchedules: () => serviceSchedules,
  services: () => services,
  siteSettings: () => siteSettings,
  specialistSchedules: () => specialistSchedules,
  specialists: () => specialists,
  uploadedImages: () => uploadedImages
});
import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var specialists = pgTable("specialists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialtyEn: text("specialty_en").notNull(),
  specialtyPt: text("specialty_pt").notNull(),
  bioEn: text("bio_en").default(""),
  bioPt: text("bio_pt").default(""),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertSpecialistSchema = createInsertSchema(specialists).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var specialistSchedules = pgTable("specialist_schedules", {
  id: serial("id").primaryKey(),
  specialistId: integer("specialist_id").notNull().references(() => specialists.id, { onDelete: "cascade" }),
  dateType: text("date_type").notNull(),
  // 'specific' | 'weekdays' | 'all_week'
  dateValue: text("date_value"),
  // ISO date string for 'specific', null for others
  availableText: text("available_text").notNull(),
  // e.g. "9:00 - 17:00"
  createdAt: timestamp("created_at").defaultNow()
});
var insertSpecialistScheduleSchema = createInsertSchema(
  specialistSchedules
).omit({ id: true, createdAt: true });
var services = pgTable("services", {
  id: serial("id").primaryKey(),
  providerName: text("provider_name").notNull(),
  serviceEn: text("service_en").notNull(),
  servicePt: text("service_pt").notNull(),
  bioEn: text("bio_en").default(""),
  bioPt: text("bio_pt").default(""),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var serviceSchedules = pgTable("service_schedules", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  dateType: text("date_type").notNull(),
  dateValue: text("date_value"),
  availabilityText: text("availability_text").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertServiceScheduleSchema = createInsertSchema(
  serviceSchedules
).omit({ id: true, createdAt: true });
var siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  valueEn: text("value_en").default(""),
  valuePt: text("value_pt").default(""),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true
});
var uploadedImages = pgTable("uploaded_images", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  data: text("data").notNull(),
  // base64 encoded
  createdAt: timestamp("created_at").defaultNow()
});

// server/db.ts
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var sql = neon(process.env.DATABASE_URL);
var db = drizzle(sql, { schema: schema_exports });

// server/routes.ts
import { eq } from "drizzle-orm";
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "duarteisking";
function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
function registerRoutes(app2) {
  app2.get("/api/specialists", async (_req, res) => {
    try {
      const allSpecialists = await db.select().from(specialists).orderBy(specialists.sortOrder);
      const allSchedules = await db.select().from(specialistSchedules);
      const result = allSpecialists.map((s) => ({
        ...s,
        schedules: allSchedules.filter((sc) => sc.specialistId === s.id)
      }));
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch specialists:", error);
      res.status(500).json({ error: "Failed to fetch specialists" });
    }
  });
  app2.get("/api/services", async (_req, res) => {
    try {
      const allServices = await db.select().from(services).orderBy(services.sortOrder);
      const allSchedules = await db.select().from(serviceSchedules);
      const result = allServices.map((s) => ({
        ...s,
        schedules: allSchedules.filter((sc) => sc.serviceId === s.id)
      }));
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });
  app2.get("/api/settings", async (_req, res) => {
    try {
      const allSettings = await db.select().from(siteSettings);
      const settingsMap = {};
      allSettings.forEach((s) => {
        settingsMap[s.key] = { valueEn: s.valueEn, valuePt: s.valuePt };
      });
      res.json(settingsMap);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });
  app2.get("/api/images/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).send("Invalid ID");
      const [image] = await db.select().from(uploadedImages).where(eq(uploadedImages.id, id));
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
  app2.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.post("/api/admin/login", (req, res) => {
    const { password } = req.body || {};
    if (!password) {
      console.error("Admin login: no password provided in request body");
      return res.status(400).json({ error: "Password required" });
    }
    if (password.trim() === ADMIN_PASSWORD) {
      res.json({ success: true });
    } else {
      console.error("Admin login: incorrect password attempt");
      res.status(401).json({ error: "Invalid password" });
    }
  });
  app2.post("/api/admin/upload-image", adminAuth, async (req, res) => {
    try {
      const { filename, contentType, data } = req.body;
      if (!filename || !contentType || !data) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const [result] = await db.insert(uploadedImages).values({ filename, contentType, data }).returning();
      res.json({ id: result.id, url: `/api/images/${result.id}` });
    } catch (error) {
      console.error("Failed to upload image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
  app2.post("/api/admin/specialists", adminAuth, async (req, res) => {
    try {
      const data = insertSpecialistSchema.parse(req.body);
      const [result] = await db.insert(specialists).values(data).returning();
      res.json(result);
    } catch (error) {
      console.error("Failed to create specialist:", error);
      res.status(400).json({ error: "Invalid data" });
    }
  });
  app2.put("/api/admin/specialists/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertSpecialistSchema.partial().parse(req.body);
      const [result] = await db.update(specialists).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(specialists.id, id)).returning();
      res.json(result);
    } catch (error) {
      console.error("Failed to update specialist:", error);
      res.status(400).json({ error: "Invalid data" });
    }
  });
  app2.delete("/api/admin/specialists/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(specialists).where(eq(specialists.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete specialist:", error);
      res.status(500).json({ error: "Failed to delete" });
    }
  });
  app2.post(
    "/api/admin/specialist-schedules",
    adminAuth,
    async (req, res) => {
      try {
        const data = insertSpecialistScheduleSchema.parse(req.body);
        const [result] = await db.insert(specialistSchedules).values(data).returning();
        res.json(result);
      } catch (error) {
        console.error("Failed to create schedule:", error);
        res.status(400).json({ error: "Invalid data" });
      }
    }
  );
  app2.delete(
    "/api/admin/specialist-schedules/:id",
    adminAuth,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await db.delete(specialistSchedules).where(eq(specialistSchedules.id, id));
        res.json({ success: true });
      } catch (error) {
        console.error("Failed to delete schedule:", error);
        res.status(500).json({ error: "Failed to delete" });
      }
    }
  );
  app2.post("/api/admin/services", adminAuth, async (req, res) => {
    try {
      const data = insertServiceSchema.parse(req.body);
      const [result] = await db.insert(services).values(data).returning();
      res.json(result);
    } catch (error) {
      console.error("Failed to create service:", error);
      res.status(400).json({ error: "Invalid data" });
    }
  });
  app2.put("/api/admin/services/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertServiceSchema.partial().parse(req.body);
      const [result] = await db.update(services).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(services.id, id)).returning();
      res.json(result);
    } catch (error) {
      console.error("Failed to update service:", error);
      res.status(400).json({ error: "Invalid data" });
    }
  });
  app2.delete("/api/admin/services/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(services).where(eq(services.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete service:", error);
      res.status(500).json({ error: "Failed to delete" });
    }
  });
  app2.post("/api/admin/service-schedules", adminAuth, async (req, res) => {
    try {
      const data = insertServiceScheduleSchema.parse(req.body);
      const [result] = await db.insert(serviceSchedules).values(data).returning();
      res.json(result);
    } catch (error) {
      console.error("Failed to create service schedule:", error);
      res.status(400).json({ error: "Invalid data" });
    }
  });
  app2.delete(
    "/api/admin/service-schedules/:id",
    adminAuth,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        await db.delete(serviceSchedules).where(eq(serviceSchedules.id, id));
        res.json({ success: true });
      } catch (error) {
        console.error("Failed to delete service schedule:", error);
        res.status(500).json({ error: "Failed to delete" });
      }
    }
  );
  app2.get("/api/admin/settings", adminAuth, async (_req, res) => {
    try {
      const allSettings = await db.select().from(siteSettings);
      res.json(allSettings);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });
  app2.put("/api/admin/settings/:key", adminAuth, async (req, res) => {
    try {
      const { key } = req.params;
      const { valueEn, valuePt } = req.body;
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
      if (existing.length > 0) {
        const [result] = await db.update(siteSettings).set({ valueEn, valuePt, updatedAt: /* @__PURE__ */ new Date() }).where(eq(siteSettings.key, key)).returning();
        res.json(result);
      } else {
        const [result] = await db.insert(siteSettings).values({ key, valueEn, valuePt }).returning();
        res.json(result);
      }
    } catch (error) {
      console.error("Failed to update setting:", error);
      res.status(500).json({ error: "Failed to update setting" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/api-entry.ts
var app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.get("/api/debug", (_req, res) => {
  res.json({
    status: "ok",
    hasDbUrl: !!process.env.DATABASE_URL,
    hasAdminPw: !!process.env.ADMIN_PASSWORD,
    nodeVersion: process.version,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
registerRoutes(app);
var api_entry_default = app;
export {
  api_entry_default as default
};
