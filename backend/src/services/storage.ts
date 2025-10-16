import { Filament } from '../types/filament';
import { databaseService } from './database';

class StorageService {
  async getAllFilaments(): Promise<Filament[]> {
    return databaseService.getAllFilaments();
  }

  async getFilamentById(id: string): Promise<Filament | null> {
    return databaseService.getFilamentById(id);
  }

  async createFilament(filamentData: Omit<Filament, 'id' | 'createdAt' | 'updatedAt'>): Promise<Filament> {
    return databaseService.createFilament(filamentData);
  }

  async updateFilament(id: string, updates: Partial<Omit<Filament, 'id' | 'createdAt'>>): Promise<Filament | null> {
    return databaseService.updateFilament(id, updates);
  }

  async deleteFilament(id: string): Promise<boolean> {
    return databaseService.deleteFilament(id);
  }

  async reduceFilamentAmount(id: string, amountToReduce: number): Promise<Filament | null> {
    return databaseService.reduceFilamentAmount(id, amountToReduce);
  }

  // Additional methods for analytics
  async getTotalFilaments(): Promise<number> {
    return databaseService.getTotalFilaments();
  }

  async getTotalValue(): Promise<{ total: number; currency: string }[]> {
    return databaseService.getTotalValue();
  }

  async getBrandStats(): Promise<{ brand: string; count: number }[]> {
    return databaseService.getBrandStats();
  }
}

export const storageService = new StorageService();
