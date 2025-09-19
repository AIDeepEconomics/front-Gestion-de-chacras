import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertIndustrialPlantSchema,
  insertSiloSchema, 
  insertRiceBatchSchema,
  insertTransferSchema,
  insertTransferBatchDetailSchema,
  insertIndustrialProcessSchema,
  insertPlantTransferSettingsSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Industrial Plants routes
  app.get("/api/plants", async (req, res) => {
    try {
      const plants = await storage.getIndustrialPlants();
      res.json(plants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plants" });
    }
  });

  app.get("/api/plants/:id", async (req, res) => {
    try {
      const plant = await storage.getIndustrialPlant(req.params.id);
      if (!plant) {
        return res.status(404).json({ error: "Plant not found" });
      }
      res.json(plant);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plant" });
    }
  });

  app.post("/api/plants", async (req, res) => {
    try {
      const validatedData = insertIndustrialPlantSchema.parse(req.body);
      const plant = await storage.createIndustrialPlant(validatedData);
      res.status(201).json(plant);
    } catch (error) {
      res.status(400).json({ error: "Invalid plant data", details: error });
    }
  });

  app.put("/api/plants/:id", async (req, res) => {
    try {
      const validatedData = insertIndustrialPlantSchema.partial().parse(req.body);
      const plant = await storage.updateIndustrialPlant(req.params.id, validatedData);
      if (!plant) {
        return res.status(404).json({ error: "Plant not found" });
      }
      res.json(plant);
    } catch (error) {
      res.status(400).json({ error: "Invalid plant data", details: error });
    }
  });

  app.delete("/api/plants/:id", async (req, res) => {
    try {
      const success = await storage.deleteIndustrialPlant(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Plant not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete plant" });
    }
  });

  // Silos routes
  app.get("/api/silos", async (req, res) => {
    try {
      const { plantId } = req.query;
      const silos = plantId 
        ? await storage.getSilosByPlant(plantId as string)
        : await storage.getSilos();
      res.json(silos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch silos" });
    }
  });

  app.get("/api/silos/:id", async (req, res) => {
    try {
      const silo = await storage.getSilo(req.params.id);
      if (!silo) {
        return res.status(404).json({ error: "Silo not found" });
      }
      res.json(silo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch silo" });
    }
  });

  app.post("/api/silos", async (req, res) => {
    try {
      const validatedData = insertSiloSchema.parse(req.body);
      const silo = await storage.createSilo(validatedData);
      res.status(201).json(silo);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Industrial plant not found") {
          return res.status(400).json({ error: "Industrial plant not found" });
        }
      }
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid silo data", issues: (error as any).issues });
      }
      res.status(500).json({ error: "Failed to create silo" });
    }
  });

  app.put("/api/silos/:id", async (req, res) => {
    try {
      const validatedData = insertSiloSchema.partial().parse(req.body);
      const silo = await storage.updateSilo(req.params.id, validatedData);
      if (!silo) {
        return res.status(404).json({ error: "Silo not found" });
      }
      res.json(silo);
    } catch (error) {
      res.status(400).json({ error: "Invalid silo data", details: error });
    }
  });

  app.delete("/api/silos/:id", async (req, res) => {
    try {
      const success = await storage.deleteSilo(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Silo not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete silo" });
    }
  });

  // Rice Batches routes
  app.get("/api/rice-batches", async (req, res) => {
    try {
      const { siloId } = req.query;
      const batches = siloId
        ? await storage.getRiceBatchesBySilo(siloId as string)
        : await storage.getRiceBatches();
      res.json(batches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rice batches" });
    }
  });

  app.get("/api/rice-batches/:id", async (req, res) => {
    try {
      const batch = await storage.getRiceBatch(req.params.id);
      if (!batch) {
        return res.status(404).json({ error: "Rice batch not found" });
      }
      res.json(batch);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rice batch" });
    }
  });

  app.post("/api/rice-batches", async (req, res) => {
    try {
      const validatedData = insertRiceBatchSchema.parse(req.body);
      const batch = await storage.createRiceBatch(validatedData);
      res.status(201).json(batch);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Silo not found") {
          return res.status(400).json({ error: "Silo not found" });
        }
      }
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid rice batch data", issues: (error as any).issues });
      }
      res.status(500).json({ error: "Failed to create rice batch" });
    }
  });

  app.put("/api/rice-batches/:id", async (req, res) => {
    try {
      const validatedData = insertRiceBatchSchema.partial().parse(req.body);
      const batch = await storage.updateRiceBatch(req.params.id, validatedData);
      if (!batch) {
        return res.status(404).json({ error: "Rice batch not found" });
      }
      res.json(batch);
    } catch (error) {
      res.status(400).json({ error: "Invalid rice batch data", details: error });
    }
  });

  app.delete("/api/rice-batches/:id", async (req, res) => {
    try {
      const success = await storage.deleteRiceBatch(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Rice batch not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete rice batch" });
    }
  });

  // Transfers routes
  app.get("/api/transfers", async (req, res) => {
    try {
      const { plantId } = req.query;
      const transfers = plantId
        ? await storage.getTransfersByPlant(plantId as string) 
        : await storage.getTransfers();
      res.json(transfers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transfers" });
    }
  });

  app.get("/api/transfers/:id", async (req, res) => {
    try {
      const transfer = await storage.getTransfer(req.params.id);
      if (!transfer) {
        return res.status(404).json({ error: "Transfer not found" });
      }
      
      // Include batch details
      const batchDetails = await storage.getTransferBatchDetails(req.params.id);
      res.json({ ...transfer, batchDetails });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transfer" });
    }
  });

  app.post("/api/transfers", async (req, res) => {
    try {
      const validatedData = insertTransferSchema.parse(req.body);
      const transfer = await storage.createTransfer(validatedData);
      res.status(201).json(transfer);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("silo not found")) {
          return res.status(400).json({ error: error.message });
        }
      }
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid transfer data", issues: (error as any).issues });
      }
      res.status(500).json({ error: "Failed to create transfer" });
    }
  });

  // Transfer Batch Details routes
  app.get("/api/transfers/:id/batch-details", async (req, res) => {
    try {
      const details = await storage.getTransferBatchDetails(req.params.id);
      res.json(details);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transfer batch details" });
    }
  });

  app.post("/api/transfers/:id/batch-details", async (req, res) => {
    try {
      const validatedData = insertTransferBatchDetailSchema.parse({
        ...req.body,
        transferId: req.params.id
      });
      const detail = await storage.createTransferBatchDetail(validatedData);
      res.status(201).json(detail);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Transfer not found" || error.message === "Rice batch not found") {
          return res.status(400).json({ error: error.message });
        }
      }
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid batch detail data", issues: (error as any).issues });
      }
      res.status(500).json({ error: "Failed to create transfer batch detail" });
    }
  });

  // Industrial Processes routes
  app.get("/api/industrial-processes", async (req, res) => {
    try {
      const { siloId } = req.query;
      const processes = siloId
        ? await storage.getIndustrialProcessesBySilo(siloId as string)
        : await storage.getIndustrialProcesses();
      res.json(processes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch industrial processes" });
    }
  });

  app.post("/api/industrial-processes", async (req, res) => {
    try {
      const validatedData = insertIndustrialProcessSchema.parse(req.body);
      const process = await storage.createIndustrialProcess(validatedData);
      res.status(201).json(process);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Silo not found") {
          return res.status(400).json({ error: "Silo not found" });
        }
      }
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid process data", issues: (error as any).issues });
      }
      res.status(500).json({ error: "Failed to create industrial process" });
    }
  });

  // Plant Transfer Settings routes
  app.get("/api/plants/:plantId/transfer-settings", async (req, res) => {
    try {
      const settings = await storage.getPlantTransferSettings(req.params.plantId);
      if (!settings) {
        // Return default settings shape if none exist
        return res.json({ 
          id: null,
          industrialPlantId: req.params.plantId,
          defaultTransferLogic: "proportional_mix"
        });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transfer settings" });
    }
  });

  app.put("/api/plants/:plantId/transfer-settings", async (req, res) => {
    try {
      const validatedData = insertPlantTransferSettingsSchema.parse({
        ...req.body,
        industrialPlantId: req.params.plantId
      });
      const settings = await storage.upsertPlantTransferSettings(validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: "Invalid transfer settings data", details: error });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
