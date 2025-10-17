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
    // Create users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        email_verified INTEGER DEFAULT 0,
        last_login TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Create magic link tokens table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS magic_tokens (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at TEXT NOT NULL,
        used INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create sessions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        refresh_token TEXT UNIQUE NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        last_used TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create cookie consent table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS cookie_consents (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        analytics_consent INTEGER DEFAULT 0,
        marketing_consent INTEGER DEFAULT 0,
        preferences_consent INTEGER DEFAULT 1,
        ip_address TEXT,
        user_agent TEXT,
        consent_version TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

        // Create notes table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create filaments table (updated with user_id)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS filaments (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        brand TEXT NOT NULL,
        filamentType TEXT NOT NULL,
        typeModifier TEXT,
        color TEXT NOT NULL,
        amount INTEGER NOT NULL,
        cost REAL NOT NULL,
        currency TEXT NOT NULL CHECK (currency IN ('SEK', 'EUR', 'USD')),
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Migrate existing filaments table to add user_id column
    this.migrateFilamentsTable();

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_filaments_user_id ON filaments(user_id);
      CREATE INDEX IF NOT EXISTS idx_filaments_brand ON filaments(brand);
      CREATE INDEX IF NOT EXISTS idx_filaments_type ON filaments(filamentType);
      CREATE INDEX IF NOT EXISTS idx_filaments_color ON filaments(color);
      CREATE INDEX IF NOT EXISTS idx_filaments_created_at ON filaments(createdAt);
      CREATE INDEX IF NOT EXISTS idx_magic_tokens_token ON magic_tokens(token);
      CREATE INDEX IF NOT EXISTS idx_magic_tokens_expires_at ON magic_tokens(expires_at);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token);
      CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
      CREATE INDEX IF NOT EXISTS idx_cookie_consents_user_id ON cookie_consents(user_id);
    `);

    console.log('✅ Database tables initialized');
  }

  private migrateFilamentsTable(): void {
    // Since we're starting with a fresh database, no migration needed
    console.log('✅ Database schema is up to date');
  }

  private createDefaultUserForMigration(): void {
    // Create a default user for existing filaments data
    const defaultUserId = 'legacy-user-migration';
    const now = new Date().toISOString();
    
    this.db.run(`
      INSERT OR IGNORE INTO users (id, email, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `, [defaultUserId, 'legacy@filamentory.local', 1, now, now], (err) => {
      if (err) {
        console.error('Error creating default user:', err);
      } else {
        console.log('✅ Created default user for migration');
        
        // Assign all existing filaments to the default user
        this.db.run(`
          UPDATE filaments SET user_id = ? WHERE user_id IS NULL
        `, [defaultUserId], (err) => {
          if (err) {
            console.error('Error assigning filaments to default user:', err);
          } else {
            console.log('✅ Assigned existing filaments to default user');
          }
        });
      }
    });
  }

  // Filament CRUD operations
  getAllFilaments(userId: string): Promise<Filament[]> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM filaments WHERE user_id = ? ORDER BY createdAt DESC');
      stmt.all(userId, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Filament[]);
      });
    });
  }

  getFilamentById(id: string, userId: string): Promise<Filament | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM filaments WHERE id = ? AND user_id = ?');
      stmt.get(id, userId, (err: any, row: any) => {
        if (err) reject(err);
        else resolve((row as Filament) || null);
      });
    });
  }

  createFilament(filamentData: Omit<Filament, 'id' | 'createdAt' | 'updatedAt'> & { userId: string }): Promise<Filament> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const id = require('uuid').v4();
      
      const stmt = this.db.prepare(`
        INSERT INTO filaments (id, user_id, brand, filamentType, typeModifier, color, amount, cost, currency, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
            filamentData.userId,
        filamentData.brand,
        filamentData.filamentType,
        filamentData.typeModifier || null,
        filamentData.color,
        filamentData.amount,
        filamentData.cost,
        filamentData.currency,
        now,
        now,
            (err: any) => {
          if (err) reject(err);
          else {
                this.getFilamentById(id, filamentData.userId).then((result) => {
                  if (result) resolve(result);
                  else reject(new Error('Failed to retrieve created filament'));
                }).catch(reject);
          }
        }
      );
    });
  }

  updateFilament(id: string, userId: string, updates: Partial<Omit<Filament, 'id' | 'createdAt'>>): Promise<Filament | null> {
    return new Promise((resolve, reject) => {
      this.getFilamentById(id, userId).then(existing => {
        if (!existing) {
          resolve(null);
          return;
        }

        const now = new Date().toISOString();
        const updatedFilament = { ...existing, ...updates, updatedAt: now };

        const stmt = this.db.prepare(`
          UPDATE filaments 
          SET brand = ?, filamentType = ?, typeModifier = ?, color = ?, amount = ?, cost = ?, currency = ?, updatedAt = ?
          WHERE id = ? AND user_id = ?
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
              userId,
              (err: any) => {
            if (err) reject(err);
            else {
                  this.getFilamentById(id, userId).then(resolve).catch(reject);
            }
          }
        );
      }).catch(reject);
    });
  }

  deleteFilament(id: string, userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('DELETE FROM filaments WHERE id = ? AND user_id = ?');
      stmt.run(id, userId, function(this: any, err: any) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }

  reduceFilamentAmount(id: string, userId: string, amountToReduce: number): Promise<Filament | null> {
    return new Promise((resolve, reject) => {
      this.getFilamentById(id, userId).then(existing => {
        if (!existing) {
          resolve(null);
          return;
        }

        const newAmount = Math.max(0, existing.amount - amountToReduce);
        this.updateFilament(id, userId, { amount: newAmount }).then(resolve).catch(reject);
      }).catch(reject);
    });
  }

  // Statistics and analytics
  getTotalFilaments(userId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT COUNT(*) as count FROM filaments WHERE user_id = ?');
      stmt.get(userId, (err, row: any) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
  }

  getTotalValue(userId: string): Promise<{ total: number; currency: string }[]> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        SELECT currency, SUM(cost) as total 
        FROM filaments 
        WHERE user_id = ?
        GROUP BY currency
      `);
      stmt.all(userId, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as { total: number; currency: string }[]);
      });
    });
  }

  getBrandStats(userId: string): Promise<{ brand: string; count: number }[]> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        SELECT brand, COUNT(*) as count 
        FROM filaments 
        WHERE user_id = ?
        GROUP BY brand 
        ORDER BY count DESC
      `);
      stmt.all(userId, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as { brand: string; count: number }[]);
      });
    });
  }

  // User management
  createUser(email: string): Promise<{ id: string; email: string; email_verified: number; last_login: string | null; created_at: string; updated_at: string }> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const id = require('uuid').v4();
      
      const stmt = this.db.prepare(`
        INSERT INTO users (id, email, email_verified, created_at, updated_at)
        VALUES (?, ?, 0, ?, ?)
      `);

      stmt.run(id, email, now, now, function(err: any) {
        if (err) reject(err);
        else {
          resolve({
            id,
            email,
            email_verified: 0,
            last_login: null,
            created_at: now,
            updated_at: now
          });
        }
      });
    });
  }

  getUserByEmail(email: string): Promise<{ id: string; email: string; email_verified: number; last_login: string | null; created_at: string; updated_at: string } | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
      stmt.get(email, (err, row: any) => {
        if (err) reject(err);
        else resolve(row || null);
      });
    });
  }

  getUserById(id: string): Promise<{ id: string; email: string; email_verified: number; last_login: string | null; created_at: string; updated_at: string } | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
      stmt.get(id, (err, row: any) => {
        if (err) reject(err);
        else resolve(row || null);
      });
    });
  }

  updateUserLastLogin(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const stmt = this.db.prepare('UPDATE users SET last_login = ?, updated_at = ? WHERE id = ?');
      stmt.run(now, now, userId, (err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Magic token management
  createMagicToken(userId: string, token: string, expiresAt: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const id = require('uuid').v4();
      
      const stmt = this.db.prepare(`
        INSERT INTO magic_tokens (id, user_id, token, expires_at, used, created_at)
        VALUES (?, ?, ?, ?, 0, ?)
      `);

      stmt.run(id, userId, token, expiresAt, now, (err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  getMagicToken(token: string): Promise<{ id: string; user_id: string; token: string; expires_at: string; used: number; created_at: string } | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM magic_tokens WHERE token = ? AND used = 0');
      stmt.get(token, (err, row: any) => {
        if (err) reject(err);
        else resolve(row || null);
      });
    });
  }

  getMagicTokenByUserAndCode(userId: string, code: string): Promise<{ id: string; user_id: string; token: string; expires_at: string; used: number; created_at: string } | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM magic_tokens WHERE user_id = ? AND token LIKE ? AND used = 0 ORDER BY created_at DESC LIMIT 1');
      stmt.get(userId, `${code}-%`, (err: any, row: any) => {
        if (err) reject(err);
        else resolve(row || null);
      });
    });
  }

  markMagicTokenAsUsed(tokenId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('UPDATE magic_tokens SET used = 1 WHERE id = ?');
      stmt.run(tokenId, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  invalidateUserMagicTokens(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('UPDATE magic_tokens SET used = 1 WHERE user_id = ? AND used = 0');
      stmt.run(userId, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Session management
  createSession(userId: string, refreshToken: string, expiresAt: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const id = require('uuid').v4();
      
      const stmt = this.db.prepare(`
        INSERT INTO sessions (id, user_id, refresh_token, expires_at, created_at, last_used)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run(id, userId, refreshToken, expiresAt, now, now, (err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  getSessionByRefreshToken(refreshToken: string): Promise<{ id: string; user_id: string; refresh_token: string; expires_at: string; created_at: string; last_used: string } | null> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM sessions WHERE refresh_token = ?');
      stmt.get(refreshToken, (err, row: any) => {
        if (err) reject(err);
        else resolve(row || null);
      });
    });
  }

  updateSessionLastUsed(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const stmt = this.db.prepare('UPDATE sessions SET last_used = ? WHERE id = ?');
      stmt.run(now, sessionId, (err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  deleteSession(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('DELETE FROM sessions WHERE id = ?');
      stmt.run(sessionId, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Notes management
  getAllNotes(userId: string): Promise<{ id: string; user_id: string; title: string; content: string; category: string; created_at: string; updated_at: string }[]> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC');
      stmt.all(userId, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as any[]);
      });
    });
  }

  createNote(userId: string, title: string, content: string, category: string): Promise<{ id: string; user_id: string; title: string; content: string; category: string; created_at: string; updated_at: string }> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const id = require('uuid').v4();
      
      const stmt = this.db.prepare(`
        INSERT INTO notes (id, user_id, title, content, category, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(id, userId, title, content, category, now, now, function(err: any) {
        if (err) reject(err);
        else {
          resolve({
            id,
            user_id: userId,
            title,
            content,
            category,
            created_at: now,
            updated_at: now
          });
        }
      });
    });
  }

  updateNote(noteId: string, userId: string, title: string, content: string, category: string): Promise<{ id: string; user_id: string; title: string; content: string; category: string; created_at: string; updated_at: string } | null> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      
      const stmt = this.db.prepare(`
        UPDATE notes 
        SET title = ?, content = ?, category = ?, updated_at = ?
        WHERE id = ? AND user_id = ?
      `);

      stmt.run(title, content, category, now, noteId, userId, function(this: any, err: any) {
        if (err) reject(err);
        else if (this.changes === 0) {
          resolve(null);
        } else {
          // Get updated note
          const getStmt = this.db.prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?');
          getStmt.get(noteId, userId, (err: any, row: any) => {
            if (err) reject(err);
            else resolve(row);
          });
        }
      });
    });
  }

  deleteNote(noteId: string, userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?');
      stmt.run(noteId, userId, function(this: any, err: any) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }

  close(): void {
    this.db.close();
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();