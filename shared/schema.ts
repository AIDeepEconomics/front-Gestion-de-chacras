import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const mills = pgTable("mills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  shareFieldManagement: boolean("share_field_management").default(false),
  shareHarvestManagement: boolean("share_harvest_management").default(false),
  shareTraceabilityInfo: boolean("share_traceability_info").default(false),
});

export const establishments = pgTable("establishments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
});

export const chacras = pgTable("chacras", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  area: text("area").notNull(), // in hectares
  regime: text("regime").notNull(), // propiedad, arrendamiento, gestionando para terceros
  establishmentId: varchar("establishment_id").references(() => establishments.id),
  establishmentName: text("establishment_name").notNull(), // denormalized for easier querying
});

export const zafras = pgTable("zafras", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chacraId: varchar("chacra_id").references(() => chacras.id),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  type: text("type").notNull(), // arroz, pasturas
  variety: text("variety"), // variedad de arroz o mezcla forrajera
  waterLevel: text("water_level"), // lámina de agua para arroz
  notes: text("notes"),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chacraId: varchar("chacra_id").references(() => chacras.id),
  zafraId: varchar("zafra_id").references(() => zafras.id),
  type: text("type").notNull(), // laboreo, fertilización, siembra, emergencia, inundación, aplicación, drenado, cosecha
  date: text("date").notNull(),
  details: text("details"), // detalles como "urea, 80 kg/ha"
  notes: text("notes"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMillSchema = createInsertSchema(mills).omit({
  id: true,
});

export const insertEstablishmentSchema = createInsertSchema(establishments).omit({
  id: true,
});

export const insertChacraSchema = createInsertSchema(chacras).omit({
  id: true,
});

export const insertZafraSchema = createInsertSchema(zafras).omit({
  id: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Mill = typeof mills.$inferSelect;
export type InsertMill = z.infer<typeof insertMillSchema>;
export type Establishment = typeof establishments.$inferSelect;
export type InsertEstablishment = z.infer<typeof insertEstablishmentSchema>;
export type Chacra = typeof chacras.$inferSelect;
export type InsertChacra = z.infer<typeof insertChacraSchema>;
export type Zafra = typeof zafras.$inferSelect;
export type InsertZafra = z.infer<typeof insertZafraSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
