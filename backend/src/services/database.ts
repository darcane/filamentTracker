import sqlite3 from 'sqlite3';
import path from 'path';
import { Filament } from '../types/filament';

const DB_PATH = path.join(__dirname, '../../data/filaments.db');

class DatabaseService {
  private db: sqlite3.Database;

  constructor() {
    // Ensure data directory exists
    const fs = require('fs');
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new sqlite3.Database(DB_PATH);
    this.initializeTables();
  }

  private initializeTables(): void {
    // Create filaments table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS filaments (
        id TEXT PRIMARY KEY,
        brand TEXT NOT NULL,
        filamentType TEXT NOT NULL,
        typeModifier TEXT,
        color TEXT NOT NULL,
        amount INTEGER NOT NULL,
        cost REAL NOT NULL,
        currency TEXT NOT NULL CHECK (currency IN ('SEK', 'EUR', 'USD')),
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_filaments_brand ON filaments(brand);
      CREATE INDEX IF NOT EXISTS idx_filaments_type ON filaments(filamentType);
      CREATE INDEX IF NOT EXISTS idx_filaments_color ON filaments(color);
      CREATE INDEX IF NOT EXISTS idx_filaments_created_at ON filaments(createdAt);
    `);

    console.log('✅ Database tables initialized');
  }

  // Filament CRUD operations
  getAllFilaments(): Promise<Filament[]> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM filaments ORDER BY createdAt DESC');
      stmt.all((err, rows) => {
        if (err) reject(err);
        else resolve(rows as Filament[]);
      });
    });
  }

  getFilamentById(id: string): Promise<Filament | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM filaments WHERE id = ?');
      stmt.get(id, (err, row) => {
        if (err) reject(err);
        else resolve((row as Filament) || null);
      });
    });
  }

  createFilament(filamentData: Omit<Filament, 'id' | 'createdAt' | 'updatedAt'>): Promise<Filament> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const id = require('uuid').v4();
      
      const stmt = this.db.prepare(`
        INSERT INTO filaments (id, brand, filamentType, typeModifier, color, amount, cost, currency, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        filamentData.brand,
        filamentData.filamentType,
        filamentData.typeModifier || null,
        filamentData.color,
        filamentData.amount,
        filamentData.cost,
        filamentData.currency,
        now,
        now,
        (err) => {
          if (err) reject(err);
          else {
            this.getFilamentById(id).then(resolve).catch(reject);
          }
        }
      );
    });
  }

  updateFilament(id: string, updates: Partial<Omit<Filament, 'id' | 'createdAt'>>): Promise<Filament | null> {
    return new Promise((resolve, reject) => {
      this.getFilamentById(id).then(existing => {
        if (!existing) {
          resolve(null);
          return;
        }

        const now = new Date().toISOString();
        const updatedFilament = { ...existing, ...updates, updatedAt: now };

        const stmt = this.db.prepare(`
          UPDATE filaments 
          SET brand = ?, filamentType = ?, typeModifier = ?, color = ?, amount = ?, cost = ?, currency = ?, updatedAt = ?
          WHERE id = ?
        `);

        stmt.run(
          updatedFilament.brand,
          updatedFilament.filamentType,
          updatedFilament.typeModifier || null,
          updatedFilament.color,
          updatedFilament.amount,
          updatedFilament.cost,
          updatedFilament.currency,
          updatedFilament.updatedAt,
          id,
          (err) => {
            if (err) reject(err);
            else {
              this.getFilamentById(id).then(resolve).catch(reject);
            }
          }
        );
      }).catch(reject);
    });
  }

  deleteFilament(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('DELETE FROM filaments WHERE id = ?');
      stmt.run(id, function(err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }

  reduceFilamentAmount(id: string, amountToReduce: number): Promise<Filament | null> {
    return new Promise((resolve, reject) => {
      this.getFilamentById(id).then(existing => {
        if (!existing) {
          resolve(null);
          return;
        }

        const newAmount = Math.max(0, existing.amount - amountToReduce);
        this.updateFilament(id, { amount: newAmount }).then(resolve).catch(reject);
      }).catch(reject);
    });
  }

  // Statistics and analytics
  getTotalFilaments(): Promise<number> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT COUNT(*) as count FROM filaments');
      stmt.get((err, row: any) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
  }

  getTotalValue(): Promise<{ total: number; currency: string }[]> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        SELECT currency, SUM(cost) as total 
        FROM filaments 
        GROUP BY currency
      `);
      stmt.all((err, rows) => {
        if (err) reject(err);
        else resolve(rows as { total: number; currency: string }[]);
      });
    });
  }

  getBrandStats(): Promise<{ brand: string; count: number }[]> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        SELECT brand, COUNT(*) as count 
        FROM filaments 
        GROUP BY brand 
        ORDER BY count DESC
      `);
      stmt.all((err, rows) => {
        if (err) reject(err);
        else resolve(rows as { brand: string; count: number }[]);
      });
    });
  }

  // Migration helper - import from JSON
  importFromJSON(filaments: Filament[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const insertStmt = this.db.prepare(`
        INSERT OR REPLACE INTO filaments (id, brand, filamentType, typeModifier, color, amount, cost, currency, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let completed = 0;
      let hasError = false;

      for (const filament of filaments) {
        insertStmt.run(
          filament.id,
          filament.brand,
          filament.filamentType,
          filament.typeModifier || null,
          filament.color,
          filament.amount,
          filament.cost,
          filament.currency,
          filament.createdAt,
          filament.updatedAt,
          (err) => {
            if (err && !hasError) {
              hasError = true;
              reject(err);
              return;
            }
            
            completed++;
            if (completed === filaments.length && !hasError) {
              console.log(`✅ Imported ${filaments.length} filaments from JSON`);
              resolve();
            }
          }
        );
      }
    });
  }

  close(): void {
    this.db.close();
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();