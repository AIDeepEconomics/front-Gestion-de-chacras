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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Mill = typeof mills.$inferSelect;
export type InsertMill = z.infer<typeof insertMillSchema>;
export type Establishment = typeof establishments.$inferSelect;
export type InsertEstablishment = z.infer<typeof insertEstablishmentSchema>;
export type Chacra = typeof chacras.$inferSelect;
export type InsertChacra = z.infer<typeof insertChacraSchema>;
