import { type User, type InsertUser, type Establishment, type InsertEstablishment } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Establishment operations
  getAllEstablishments(): Promise<Establishment[]>;
  getEstablishment(id: string): Promise<Establishment | undefined>;
  createEstablishment(establishment: InsertEstablishment): Promise<Establishment>;
  updateEstablishment(id: string, establishment: Partial<Establishment>): Promise<Establishment | undefined>;
  deleteEstablishment(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private establishments: Map<string, Establishment>;

  constructor() {
    this.users = new Map();
    this.establishments = new Map();
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

  async getAllEstablishments(): Promise<Establishment[]> {
    return Array.from(this.establishments.values());
  }

  async getEstablishment(id: string): Promise<Establishment | undefined> {
    return this.establishments.get(id);
  }

  async createEstablishment(insertEstablishment: InsertEstablishment): Promise<Establishment> {
    const id = randomUUID();
    const establishment: Establishment = {
      id,
      name: insertEstablishment.name,
      address: insertEstablishment.address,
      owner: insertEstablishment.owner,
      rut: insertEstablishment.rut,
      phone: insertEstablishment.phone ?? null,
      latitude: insertEstablishment.latitude ?? null,
      longitude: insertEstablishment.longitude ?? null,
      referenceCoordinates: insertEstablishment.referenceCoordinates ?? null,
      adminEmail: insertEstablishment.adminEmail ?? null,
    };
    this.establishments.set(id, establishment);
    return establishment;
  }

  async updateEstablishment(id: string, updates: Partial<Establishment>): Promise<Establishment | undefined> {
    const existing = this.establishments.get(id);
    if (!existing) {
      return undefined;
    }
    const updated: Establishment = { ...existing, ...updates, id };
    this.establishments.set(id, updated);
    return updated;
  }

  async deleteEstablishment(id: string): Promise<boolean> {
    return this.establishments.delete(id);
  }
}

export const storage = new MemStorage();
