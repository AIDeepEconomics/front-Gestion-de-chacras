import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEstablishmentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Establishment routes
  
  // GET all establishments
  app.get("/api/establishments", async (req, res) => {
    try {
      const establishments = await storage.getAllEstablishments();
      res.json(establishments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch establishments" });
    }
  });

  // GET single establishment
  app.get("/api/establishments/:id", async (req, res) => {
    try {
      const establishment = await storage.getEstablishment(req.params.id);
      if (!establishment) {
        return res.status(404).json({ error: "Establishment not found" });
      }
      res.json(establishment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch establishment" });
    }
  });

  // POST new establishment
  app.post("/api/establishments", async (req, res) => {
    try {
      const validatedData = insertEstablishmentSchema.parse(req.body);
      const establishment = await storage.createEstablishment(validatedData);
      res.status(201).json(establishment);
    } catch (error) {
      res.status(400).json({ error: "Invalid establishment data" });
    }
  });

  // PATCH update establishment
  app.patch("/api/establishments/:id", async (req, res) => {
    try {
      // Validate partial update with a subset of the schema
      const updateSchema = insertEstablishmentSchema.partial();
      const validatedData = updateSchema.parse(req.body);
      
      const establishment = await storage.updateEstablishment(req.params.id, validatedData);
      if (!establishment) {
        return res.status(404).json({ error: "Establishment not found" });
      }
      res.json(establishment);
    } catch (error) {
      res.status(400).json({ error: "Failed to update establishment" });
    }
  });

  // DELETE establishment
  app.delete("/api/establishments/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEstablishment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Establishment not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete establishment" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
