import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Specialists (medical practitioners) ──────────────────────────────
export const specialists = pgTable("specialists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialtyEn: text("specialty_en").notNull(),
  specialtyPt: text("specialty_pt").notNull(),
  bioEn: text("bio_en").default(""),
  bioPt: text("bio_pt").default(""),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSpecialistSchema = createInsertSchema(specialists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSpecialist = z.infer<typeof insertSpecialistSchema>;
export type Specialist = typeof specialists.$inferSelect;

// ── Specialist Schedules ─────────────────────────────────────────────
export const specialistSchedules = pgTable("specialist_schedules", {
  id: serial("id").primaryKey(),
  specialistId: integer("specialist_id")
    .notNull()
    .references(() => specialists.id, { onDelete: "cascade" }),
  dateType: text("date_type").notNull(), // 'specific' | 'weekdays' | 'all_week'
  dateValue: text("date_value"), // ISO date string for 'specific', null for others
  availableText: text("available_text").notNull(), // e.g. "9:00 - 17:00"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSpecialistScheduleSchema = createInsertSchema(
  specialistSchedules,
).omit({ id: true, createdAt: true });
export type InsertSpecialistSchedule = z.infer<
  typeof insertSpecialistScheduleSchema
>;
export type SpecialistSchedule = typeof specialistSchedules.$inferSelect;

// ── Services (non-medical: yoga, pilates, etc.) ─────────────────────
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  providerName: text("provider_name").notNull(),
  serviceEn: text("service_en").notNull(),
  servicePt: text("service_pt").notNull(),
  bioEn: text("bio_en").default(""),
  bioPt: text("bio_pt").default(""),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// ── Service Schedules ────────────────────────────────────────────────
export const serviceSchedules = pgTable("service_schedules", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  dateType: text("date_type").notNull(),
  dateValue: text("date_value"),
  availabilityText: text("availability_text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertServiceScheduleSchema = createInsertSchema(
  serviceSchedules,
).omit({ id: true, createdAt: true });
export type InsertServiceSchedule = z.infer<
  typeof insertServiceScheduleSchema
>;
export type ServiceSchedule = typeof serviceSchedules.$inferSelect;

// ── Site Settings (key-value, bilingual) ─────────────────────────────
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  valueEn: text("value_en").default(""),
  valuePt: text("value_pt").default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

// ── Uploaded Images ──────────────────────────────────────────────────
export const uploadedImages = pgTable("uploaded_images", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  data: text("data").notNull(), // base64 encoded
  createdAt: timestamp("created_at").defaultNow(),
});

export type UploadedImage = typeof uploadedImages.$inferSelect;
