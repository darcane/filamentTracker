import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Filament } from '../types/filament';

const DATA_FILE = path.join(__dirname, '../../data/filaments.json');

class StorageService {
  private async ensureDataFile(): Promise<void> {
    try {
      await fs.access(DATA_FILE);
    } catch {
      // File doesn't exist, create it with empty array
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
    }
  }

  private async readFilaments(): Promise<Filament[]> {
    await this.ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  }

  private async writeFilaments(filaments: Filament[]): Promise<void> {
    await this.ensureDataFile();
    await fs.writeFile(DATA_FILE, JSON.stringify(filaments, null, 2));
  }

  async getAllFilaments(): Promise<Filament[]> {
    return this.readFilaments();
  }

  async getFilamentById(id: string): Promise<Filament | null> {
    const filaments = await this.readFilaments();
    return filaments.find(f => f.id === id) || null;
  }

  async createFilament(filamentData: Omit<Filament, 'id' | 'createdAt' | 'updatedAt'>): Promise<Filament> {
    const filaments = await this.readFilaments();
    const now = new Date().toISOString();
    
    const newFilament: Filament = {
      id: uuidv4(),
      ...filamentData,
      createdAt: now,
      updatedAt: now,
    };

    filaments.push(newFilament);
    await this.writeFilaments(filaments);
    
    return newFilament;
  }

  async updateFilament(id: string, updates: Partial<Omit<Filament, 'id' | 'createdAt'>>): Promise<Filament | null> {
    const filaments = await this.readFilaments();
    const index = filaments.findIndex(f => f.id === id);
    
    if (index === -1) {
      return null;
    }

    filaments[index] = {
      ...filaments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.writeFilaments(filaments);
    return filaments[index];
  }

  async deleteFilament(id: string): Promise<boolean> {
    const filaments = await this.readFilaments();
    const initialLength = filaments.length;
    const filteredFilaments = filaments.filter(f => f.id !== id);
    
    if (filteredFilaments.length === initialLength) {
      return false; // Filament not found
    }

    await this.writeFilaments(filteredFilaments);
    return true;
  }

  async reduceFilamentAmount(id: string, amountToReduce: number): Promise<Filament | null> {
    const filaments = await this.readFilaments();
    const index = filaments.findIndex(f => f.id === id);
    
    if (index === -1) {
      return null;
    }

    const currentAmount = filaments[index].amount;
    const newAmount = Math.max(0, currentAmount - amountToReduce);
    
    filaments[index] = {
      ...filaments[index],
      amount: newAmount,
      updatedAt: new Date().toISOString(),
    };

    await this.writeFilaments(filaments);
    return filaments[index];
  }
}

export const storageService = new StorageService();
