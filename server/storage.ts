import { 
  type User, type InsertUser,
  type IndustrialPlant, type InsertIndustrialPlant,
  type Silo, type InsertSilo, 
  type RiceBatch, type InsertRiceBatch,
  type Transfer, type InsertTransfer,
  type TransferBatchDetail, type InsertTransferBatchDetail,
  type IndustrialProcess, type InsertIndustrialProcess,
  type PlantTransferSettings, type InsertPlantTransferSettings
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Industrial Plants
  getIndustrialPlants(): Promise<IndustrialPlant[]>;
  getIndustrialPlant(id: string): Promise<IndustrialPlant | undefined>;
  createIndustrialPlant(plant: InsertIndustrialPlant): Promise<IndustrialPlant>;
  updateIndustrialPlant(id: string, plant: Partial<InsertIndustrialPlant>): Promise<IndustrialPlant | undefined>;
  deleteIndustrialPlant(id: string): Promise<boolean>;

  // Silos
  getSilos(): Promise<Silo[]>;
  getSilosByPlant(industrialPlantId: string): Promise<Silo[]>;
  getSilo(id: string): Promise<Silo | undefined>;
  createSilo(silo: InsertSilo): Promise<Silo>;
  updateSilo(id: string, silo: Partial<InsertSilo>): Promise<Silo | undefined>;
  deleteSilo(id: string): Promise<boolean>;

  // Rice Batches
  getRiceBatches(): Promise<RiceBatch[]>;
  getRiceBatchesBySilo(siloId: string): Promise<RiceBatch[]>;
  getRiceBatch(id: string): Promise<RiceBatch | undefined>;
  createRiceBatch(batch: InsertRiceBatch): Promise<RiceBatch>;
  updateRiceBatch(id: string, batch: Partial<InsertRiceBatch>): Promise<RiceBatch | undefined>;
  deleteRiceBatch(id: string): Promise<boolean>;

  // Transfers
  getTransfers(): Promise<Transfer[]>;
  getTransfersByPlant(industrialPlantId: string): Promise<Transfer[]>;
  getTransfer(id: string): Promise<Transfer | undefined>;
  createTransfer(transfer: InsertTransfer): Promise<Transfer>;

  // Transfer Batch Details
  getTransferBatchDetails(transferId: string): Promise<TransferBatchDetail[]>;
  createTransferBatchDetail(detail: InsertTransferBatchDetail): Promise<TransferBatchDetail>;

  // Industrial Processes
  getIndustrialProcesses(): Promise<IndustrialProcess[]>;
  getIndustrialProcessesBySilo(siloId: string): Promise<IndustrialProcess[]>;
  createIndustrialProcess(process: InsertIndustrialProcess): Promise<IndustrialProcess>;

  // Plant Transfer Settings
  getPlantTransferSettings(industrialPlantId: string): Promise<PlantTransferSettings | undefined>;
  upsertPlantTransferSettings(settings: InsertPlantTransferSettings): Promise<PlantTransferSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private industrialPlants: Map<string, IndustrialPlant>;
  private silos: Map<string, Silo>;
  private riceBatches: Map<string, RiceBatch>;
  private transfers: Map<string, Transfer>;
  private transferBatchDetails: Map<string, TransferBatchDetail>;
  private industrialProcesses: Map<string, IndustrialProcess>;
  private plantTransferSettings: Map<string, PlantTransferSettings>;

  constructor() {
    this.users = new Map();
    this.industrialPlants = new Map();
    this.silos = new Map();
    this.riceBatches = new Map();
    this.transfers = new Map();
    this.transferBatchDetails = new Map();
    this.industrialProcesses = new Map();
    this.plantTransferSettings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Industrial Plants
  async getIndustrialPlants(): Promise<IndustrialPlant[]> {
    return Array.from(this.industrialPlants.values());
  }

  async getIndustrialPlant(id: string): Promise<IndustrialPlant | undefined> {
    return this.industrialPlants.get(id);
  }

  async createIndustrialPlant(insertPlant: InsertIndustrialPlant): Promise<IndustrialPlant> {
    const id = randomUUID();
    const plant: IndustrialPlant = { 
      ...insertPlant, 
      id,
      location: insertPlant.location ?? null,
      silos: insertPlant.silos ?? null
    };
    this.industrialPlants.set(id, plant);
    return plant;
  }

  async updateIndustrialPlant(id: string, plantUpdate: Partial<InsertIndustrialPlant>): Promise<IndustrialPlant | undefined> {
    const existing = this.industrialPlants.get(id);
    if (!existing) return undefined;
    
    const updated: IndustrialPlant = { ...existing, ...plantUpdate };
    this.industrialPlants.set(id, updated);
    return updated;
  }

  async deleteIndustrialPlant(id: string): Promise<boolean> {
    return this.industrialPlants.delete(id);
  }

  // Silos
  async getSilos(): Promise<Silo[]> {
    return Array.from(this.silos.values());
  }

  async getSilosByPlant(industrialPlantId: string): Promise<Silo[]> {
    return Array.from(this.silos.values()).filter(silo => silo.industrialPlantId === industrialPlantId);
  }

  async getSilo(id: string): Promise<Silo | undefined> {
    return this.silos.get(id);
  }

  async createSilo(insertSilo: InsertSilo): Promise<Silo> {
    // Check if industrial plant exists
    const plant = await this.getIndustrialPlant(insertSilo.industrialPlantId);
    if (!plant) {
      throw new Error("Industrial plant not found");
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const silo: Silo = { 
      ...insertSilo, 
      id, 
      createdAt,
      currentOccupancy: insertSilo.currentOccupancy || "0"
    };
    this.silos.set(id, silo);
    return silo;
  }

  async updateSilo(id: string, siloUpdate: Partial<InsertSilo>): Promise<Silo | undefined> {
    const existing = this.silos.get(id);
    if (!existing) return undefined;
    
    const updated: Silo = { ...existing, ...siloUpdate };
    this.silos.set(id, updated);
    return updated;
  }

  async deleteSilo(id: string): Promise<boolean> {
    return this.silos.delete(id);
  }

  // Rice Batches
  async getRiceBatches(): Promise<RiceBatch[]> {
    return Array.from(this.riceBatches.values());
  }

  async getRiceBatchesBySilo(siloId: string): Promise<RiceBatch[]> {
    return Array.from(this.riceBatches.values()).filter(batch => batch.siloId === siloId);
  }

  async getRiceBatch(id: string): Promise<RiceBatch | undefined> {
    return this.riceBatches.get(id);
  }

  async createRiceBatch(insertBatch: InsertRiceBatch): Promise<RiceBatch> {
    // Check if silo exists
    const silo = await this.getSilo(insertBatch.siloId);
    if (!silo) {
      throw new Error("Silo not found");
    }

    const id = randomUUID();
    const batch: RiceBatch = { 
      ...insertBatch, 
      id,
      layerOrder: insertBatch.layerOrder ?? 0
    };
    this.riceBatches.set(id, batch);
    return batch;
  }

  async updateRiceBatch(id: string, batchUpdate: Partial<InsertRiceBatch>): Promise<RiceBatch | undefined> {
    const existing = this.riceBatches.get(id);
    if (!existing) return undefined;
    
    const updated: RiceBatch = { ...existing, ...batchUpdate };
    this.riceBatches.set(id, updated);
    return updated;
  }

  async deleteRiceBatch(id: string): Promise<boolean> {
    return this.riceBatches.delete(id);
  }

  // Transfers
  async getTransfers(): Promise<Transfer[]> {
    return Array.from(this.transfers.values());
  }

  async getTransfersByPlant(industrialPlantId: string): Promise<Transfer[]> {
    return Array.from(this.transfers.values()).filter(transfer => {
      const fromSilo = transfer.fromSiloId ? this.silos.get(transfer.fromSiloId) : null;
      const toSilo = transfer.toSiloId ? this.silos.get(transfer.toSiloId) : null;
      return (fromSilo && fromSilo.industrialPlantId === industrialPlantId) || 
             (toSilo && toSilo.industrialPlantId === industrialPlantId);
    });
  }

  async getTransfer(id: string): Promise<Transfer | undefined> {
    return this.transfers.get(id);
  }

  async createTransfer(insertTransfer: InsertTransfer): Promise<Transfer> {
    // Check if silos exist
    if (insertTransfer.fromSiloId) {
      const fromSilo = await this.getSilo(insertTransfer.fromSiloId);
      if (!fromSilo) {
        throw new Error("From silo not found");
      }
    }
    
    if (insertTransfer.toSiloId) {
      const toSilo = await this.getSilo(insertTransfer.toSiloId);
      if (!toSilo) {
        throw new Error("To silo not found");
      }
    }

    const id = randomUUID();
    const transfer: Transfer = { 
      ...insertTransfer, 
      id,
      notes: insertTransfer.notes ?? null,
      fromSiloId: insertTransfer.fromSiloId ?? null,
      toSiloId: insertTransfer.toSiloId ?? null,
      saleOrderId: insertTransfer.saleOrderId ?? null
    };
    this.transfers.set(id, transfer);
    return transfer;
  }

  // Transfer Batch Details
  async getTransferBatchDetails(transferId: string): Promise<TransferBatchDetail[]> {
    return Array.from(this.transferBatchDetails.values()).filter(detail => detail.transferId === transferId);
  }

  async createTransferBatchDetail(insertDetail: InsertTransferBatchDetail): Promise<TransferBatchDetail> {
    // Check if transfer and rice batch exist
    const transfer = await this.getTransfer(insertDetail.transferId);
    if (!transfer) {
      throw new Error("Transfer not found");
    }
    
    const riceBatch = await this.getRiceBatch(insertDetail.riceBatchId);
    if (!riceBatch) {
      throw new Error("Rice batch not found");
    }

    const id = randomUUID();
    const detail: TransferBatchDetail = { ...insertDetail, id };
    this.transferBatchDetails.set(id, detail);
    return detail;
  }

  // Industrial Processes
  async getIndustrialProcesses(): Promise<IndustrialProcess[]> {
    return Array.from(this.industrialProcesses.values());
  }

  async getIndustrialProcessesBySilo(siloId: string): Promise<IndustrialProcess[]> {
    return Array.from(this.industrialProcesses.values()).filter(process => process.siloId === siloId);
  }

  async createIndustrialProcess(insertProcess: InsertIndustrialProcess): Promise<IndustrialProcess> {
    // Check if silo exists
    const silo = await this.getSilo(insertProcess.siloId);
    if (!silo) {
      throw new Error("Silo not found");
    }

    const id = randomUUID();
    const process: IndustrialProcess = { 
      ...insertProcess, 
      id,
      notes: insertProcess.notes ?? null,
      parameters: insertProcess.parameters ?? null
    };
    this.industrialProcesses.set(id, process);
    return process;
  }

  // Plant Transfer Settings
  async getPlantTransferSettings(industrialPlantId: string): Promise<PlantTransferSettings | undefined> {
    return Array.from(this.plantTransferSettings.values()).find(settings => settings.industrialPlantId === industrialPlantId);
  }

  async upsertPlantTransferSettings(insertSettings: InsertPlantTransferSettings): Promise<PlantTransferSettings> {
    const existing = await this.getPlantTransferSettings(insertSettings.industrialPlantId);
    
    if (existing) {
      const updated: PlantTransferSettings = { ...existing, ...insertSettings };
      this.plantTransferSettings.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const settings: PlantTransferSettings = { 
        ...insertSettings, 
        id,
        defaultTransferLogic: insertSettings.defaultTransferLogic ?? "proportional_mix"
      };
      this.plantTransferSettings.set(id, settings);
      return settings;
    }
  }
}

export const storage = new MemStorage();
