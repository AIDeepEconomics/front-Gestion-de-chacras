import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, decimal } from "drizzle-orm/pg-core";
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
  address: text("address").notNull(),
  phone: text("phone"),
  owner: text("owner").notNull(),
  rut: text("rut").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  referenceCoordinates: text("reference_coordinates"),
  adminEmail: text("admin_email"),
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

export const industrialPlants = pgTable("industrial_plants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location"),
  silos: text("silos").array(), // array of silo names/numbers
});

export const remitos = pgTable("remitos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chacraId: varchar("chacra_id").references(() => chacras.id).notNull(),
  chacraName: text("chacra_name").notNull(), // denormalized
  estimatedWeight: integer("estimated_weight").notNull(),
  trailerPlate: text("trailer_plate").notNull(),
  driverName: text("driver_name").notNull(),
  driverWhatsapp: text("driver_whatsapp").notNull(),
  industrialPlantId: varchar("industrial_plant_id").references(() => industrialPlants.id).notNull(),
  industrialPlantName: text("industrial_plant_name").notNull(), // denormalized
  destinationSilo: text("destination_silo"),
  status: text("status").notNull().default("creandose"), // creandose, creado, cargandose, en_viaje, descargandose, perdido_destruido, descargado
  createdAt: text("created_at"), // ISO string format
  departureDateTime: text("departure_date_time"), // ISO string format  
  arrivalDateTime: text("arrival_date_time"), // ISO string format
  notes: text("notes"),
});

export const silos = pgTable("silos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  siloId: text("silo_id").notNull(), // User-defined silo identifier
  industrialPlantId: varchar("industrial_plant_id").references(() => industrialPlants.id).notNull(),
  type: text("type").notNull(), // tipo de silo
  maxCapacity: decimal("max_capacity", { precision: 10, scale: 2 }).notNull(), // toneladas
  currentOccupancy: decimal("current_occupancy", { precision: 10, scale: 2 }).default("0"), // toneladas ocupadas
  diameter: decimal("diameter", { precision: 8, scale: 2 }).notNull(), // metros - required for FIFO logic
  createdAt: text("created_at").default(sql`now()`),
});

export const riceBatches = pgTable("rice_batches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  remitoId: varchar("remito_id").references(() => remitos.id).notNull(),
  siloId: varchar("silo_id").references(() => silos.id).notNull(),
  chacraId: varchar("chacra_id").references(() => chacras.id).notNull(),
  chacraName: text("chacra_name").notNull(), // denormalized
  variety: text("variety").notNull(), // variedad de arroz
  tonnage: decimal("tonnage", { precision: 10, scale: 2 }).notNull(),
  originalTonnage: decimal("original_tonnage", { precision: 10, scale: 2 }).notNull(), // original amount before any transfers
  entryDate: text("entry_date").notNull(), // ISO string format
  layerOrder: integer("layer_order").notNull().default(0), // for FIFO logic
});

export const transfers = pgTable("transfers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromSiloId: varchar("from_silo_id").references(() => silos.id),
  toSiloId: varchar("to_silo_id").references(() => silos.id),
  transferType: text("transfer_type").notNull(), // silo_to_silo, silo_to_sale
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  transferLogic: text("transfer_logic").notNull(), // proportional_mix, fifo_layers
  transferDate: text("transfer_date").notNull(), // ISO string format
  notes: text("notes"),
  saleOrderId: text("sale_order_id"), // if transferType is silo_to_sale
});

export const transferBatchDetails = pgTable("transfer_batch_details", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transferId: varchar("transfer_id").references(() => transfers.id).notNull(),
  riceBatchId: varchar("rice_batch_id").references(() => riceBatches.id).notNull(),
  amountTransferred: decimal("amount_transferred", { precision: 10, scale: 2 }).notNull(),
});

export const industrialProcesses = pgTable("industrial_processes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  siloId: varchar("silo_id").references(() => silos.id).notNull(),
  processType: text("process_type").notNull(), // secado, aireacion, limpieza, etc.
  processDate: text("process_date").notNull(), // ISO string format
  parameters: text("parameters"), // JSON string with process parameters
  notes: text("notes"),
});

export const plantTransferSettings = pgTable("plant_transfer_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  industrialPlantId: varchar("industrial_plant_id").references(() => industrialPlants.id).notNull(),
  defaultTransferLogic: text("default_transfer_logic").notNull().default("proportional_mix"), // proportional_mix, fifo_layers
});

export const salesOrders = pgTable("sales_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(), // ID orden visible para usuarios
  clientName: text("client_name").notNull(),
  destination: text("destination").notNull(),
  totalTonnage: decimal("total_tonnage", { precision: 10, scale: 2 }).notNull(),
  qualityRequirements: text("quality_requirements"), // JSON string con requerimientos
  status: text("status").notNull().default("Virgen"), // Virgen, En Proceso, Lista, Despachando, Despachada, Rechazada, Cancelada
  orderDate: text("order_date").default(sql`now()`),
  estimatedDeliveryDate: text("estimated_delivery_date"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`now()`),
});

export const salesOrderBatchAssignments = pgTable("sales_order_batch_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  salesOrderId: varchar("sales_order_id").references(() => salesOrders.id).notNull(),
  riceBatchId: varchar("rice_batch_id").references(() => riceBatches.id).notNull(),
  siloId: varchar("silo_id").references(() => silos.id).notNull(),
  assignedTonnage: decimal("assigned_tonnage", { precision: 10, scale: 2 }).notNull(),
  reservedAt: text("reserved_at").default(sql`now()`),
});

export const sustainabilityMetrics = pgTable("sustainability_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  salesOrderId: varchar("sales_order_id").references(() => salesOrders.id).notNull(),
  carbonFootprintPerTon: decimal("carbon_footprint_per_ton", { precision: 10, scale: 4 }), // kg CO₂-eq / ton
  waterUsagePerTon: decimal("water_usage_per_ton", { precision: 10, scale: 2 }), // L / ton
  energyUsagePerTon: decimal("energy_usage_per_ton", { precision: 10, scale: 2 }), // kWh / ton
  calculatedAt: text("calculated_at").default(sql`now()`),
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

export const insertIndustrialPlantSchema = createInsertSchema(industrialPlants).omit({
  id: true,
});

export const insertRemitoSchema = createInsertSchema(remitos).omit({
  id: true,
  createdAt: true,
});

export const insertSiloSchema = createInsertSchema(silos).omit({
  id: true,
  createdAt: true,
});

export const insertRiceBatchSchema = createInsertSchema(riceBatches).omit({
  id: true,
});

export const insertTransferSchema = createInsertSchema(transfers).omit({
  id: true,
});

export const insertTransferBatchDetailSchema = createInsertSchema(transferBatchDetails).omit({
  id: true,
});

export const insertIndustrialProcessSchema = createInsertSchema(industrialProcesses).omit({
  id: true,
});

export const insertPlantTransferSettingsSchema = createInsertSchema(plantTransferSettings).omit({
  id: true,
});

export const insertSalesOrderSchema = createInsertSchema(salesOrders).omit({
  id: true,
  createdAt: true,
});

export const insertSalesOrderBatchAssignmentSchema = createInsertSchema(salesOrderBatchAssignments).omit({
  id: true,
  reservedAt: true,
});

export const insertSustainabilityMetricsSchema = createInsertSchema(sustainabilityMetrics).omit({
  id: true,
  calculatedAt: true,
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
export type IndustrialPlant = typeof industrialPlants.$inferSelect;
export type InsertIndustrialPlant = z.infer<typeof insertIndustrialPlantSchema>;
export type Remito = typeof remitos.$inferSelect;
export type InsertRemito = z.infer<typeof insertRemitoSchema>;
export type Silo = typeof silos.$inferSelect;
export type InsertSilo = z.infer<typeof insertSiloSchema>;
export type RiceBatch = typeof riceBatches.$inferSelect;
export type InsertRiceBatch = z.infer<typeof insertRiceBatchSchema>;
export type Transfer = typeof transfers.$inferSelect;
export type InsertTransfer = z.infer<typeof insertTransferSchema>;
export type TransferBatchDetail = typeof transferBatchDetails.$inferSelect;
export type InsertTransferBatchDetail = z.infer<typeof insertTransferBatchDetailSchema>;
export type IndustrialProcess = typeof industrialProcesses.$inferSelect;
export type InsertIndustrialProcess = z.infer<typeof insertIndustrialProcessSchema>;
export type PlantTransferSettings = typeof plantTransferSettings.$inferSelect;
export type InsertPlantTransferSettings = z.infer<typeof insertPlantTransferSettingsSchema>;
export type SalesOrder = typeof salesOrders.$inferSelect;
export type InsertSalesOrder = z.infer<typeof insertSalesOrderSchema>;
export type SalesOrderBatchAssignment = typeof salesOrderBatchAssignments.$inferSelect;
export type InsertSalesOrderBatchAssignment = z.infer<typeof insertSalesOrderBatchAssignmentSchema>;
export type SustainabilityMetrics = typeof sustainabilityMetrics.$inferSelect;
export type InsertSustainabilityMetrics = z.infer<typeof insertSustainabilityMetricsSchema>;
