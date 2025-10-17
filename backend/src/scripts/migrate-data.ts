import fs from 'fs';
import path from 'path';
import { databaseService } from '../services/database';
import { Filament } from '../types/filament';

interface LegacyFilament {
  id: string;
  brand: string;
  filamentType: string;
  typeModifier?: string;
  color: string;
  amount: number;
  cost: number;
  currency: 'SEK' | 'EUR' | 'USD';
  createdAt: string;
  updatedAt: string;
}

interface LegacyNote {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

class DataMigrationService {
  private readonly dataDir = path.join(__dirname, '../../data');
  private readonly filamentsJsonPath = path.join(this.dataDir, 'filaments.json');
  private readonly notesJsonPath = path.join(this.dataDir, 'notes.json');

  async migrateAllData(): Promise<void> {
    console.log('🚀 Starting data migration...');

    try {
      // Create a default user for migrated data
      const defaultUser = await this.createDefaultUser();
      console.log(`✅ Created default user: ${defaultUser.email}`);

      // Migrate filaments
      await this.migrateFilaments(defaultUser.id);

      // Migrate notes
      await this.migrateNotes(defaultUser.id);

      // Create backup of original files
      await this.createBackups();

      console.log('✅ Data migration completed successfully!');
      console.log('📝 All data has been migrated to the new multi-user database.');
      console.log('💾 Original JSON files have been backed up.');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  private async createDefaultUser(): Promise<{ id: string; email: string }> {
    const defaultEmail = 'legacy@filamentory.local';
    
    // Check if default user already exists
    let user = await databaseService.getUserByEmail(defaultEmail);
    
    if (!user) {
      user = await databaseService.createUser(defaultEmail);
    }

    return { id: user.id, email: user.email };
  }

  private async migrateFilaments(userId: string): Promise<void> {
    if (!fs.existsSync(this.filamentsJsonPath)) {
      console.log('📄 No filaments.json file found, skipping filaments migration');
      return;
    }

    console.log('📦 Migrating filaments...');

    try {
      const filamentsData = fs.readFileSync(this.filamentsJsonPath, 'utf8');
      const filaments: LegacyFilament[] = JSON.parse(filamentsData);

      if (!Array.isArray(filaments)) {
        throw new Error('Invalid filaments.json format');
      }

      let migratedCount = 0;
      let skippedCount = 0;

      for (const filament of filaments) {
        try {
          // Check if filament already exists
          const existing = await databaseService.getFilamentById(filament.id, userId);
          
          if (existing) {
            console.log(`⏭️  Skipping existing filament: ${filament.brand} ${filament.color}`);
            skippedCount++;
            continue;
          }

          // Create new filament with user_id
          await databaseService.createFilament({
            userId,
            brand: filament.brand,
            filamentType: filament.filamentType,
            typeModifier: filament.typeModifier,
            color: filament.color,
            amount: filament.amount,
            cost: filament.cost,
            currency: filament.currency,
          });

          migratedCount++;
          console.log(`✅ Migrated: ${filament.brand} ${filament.color}`);
        } catch (error) {
          console.error(`❌ Failed to migrate filament ${filament.id}:`, error);
        }
      }

      console.log(`📦 Filaments migration complete: ${migratedCount} migrated, ${skippedCount} skipped`);
    } catch (error) {
      console.error('❌ Failed to migrate filaments:', error);
      throw error;
    }
  }

  private async migrateNotes(userId: string): Promise<void> {
    if (!fs.existsSync(this.notesJsonPath)) {
      console.log('📄 No notes.json file found, skipping notes migration');
      return;
    }

    console.log('📝 Migrating notes...');

    try {
      const notesData = fs.readFileSync(this.notesJsonPath, 'utf8');
      const notes: LegacyNote[] = JSON.parse(notesData);

      if (!Array.isArray(notes)) {
        throw new Error('Invalid notes.json format');
      }

      let migratedCount = 0;
      let skippedCount = 0;

      for (const note of notes) {
        try {
          // Check if note already exists (we'll need to implement this method)
          // For now, we'll create all notes
          
          await databaseService.createNote(
            userId,
            note.title,
            note.content,
            note.category
          );

          migratedCount++;
          console.log(`✅ Migrated note: ${note.title}`);
        } catch (error) {
          console.error(`❌ Failed to migrate note ${note.id}:`, error);
        }
      }

      console.log(`📝 Notes migration complete: ${migratedCount} migrated, ${skippedCount} skipped`);
    } catch (error) {
      console.error('❌ Failed to migrate notes:', error);
      throw error;
    }
  }

  private async createBackups(): Promise<void> {
    const backupDir = path.join(this.dataDir, 'backup');
    
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Backup filaments.json
    if (fs.existsSync(this.filamentsJsonPath)) {
      const backupPath = path.join(backupDir, `filaments-${timestamp}.json`);
      fs.copyFileSync(this.filamentsJsonPath, backupPath);
      console.log(`💾 Backed up filaments.json to ${backupPath}`);
    }

    // Backup notes.json
    if (fs.existsSync(this.notesJsonPath)) {
      const backupPath = path.join(backupDir, `notes-${timestamp}.json`);
      fs.copyFileSync(this.notesJsonPath, backupPath);
      console.log(`💾 Backed up notes.json to ${backupPath}`);
    }
  }

  async validateMigration(): Promise<void> {
    console.log('🔍 Validating migration...');

    try {
      // Check if default user exists
      const defaultUser = await databaseService.getUserByEmail('legacy@filamentory.local');
      if (!defaultUser) {
        throw new Error('Default user not found after migration');
      }

      // Check filaments count
      const filaments = await databaseService.getAllFilaments(defaultUser.id);
      console.log(`📦 Found ${filaments.length} filaments for default user`);

      // Check notes count
      const notes = await databaseService.getAllNotes(defaultUser.id);
      console.log(`📝 Found ${notes.length} notes for default user`);

      console.log('✅ Migration validation completed successfully');
    } catch (error) {
      console.error('❌ Migration validation failed:', error);
      throw error;
    }
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];

  if (command === 'migrate') {
    const migrationService = new DataMigrationService();
    await migrationService.migrateAllData();
  } else if (command === 'validate') {
    const migrationService = new DataMigrationService();
    await migrationService.validateMigration();
  } else {
    console.log('Usage:');
    console.log('  npm run migrate-data migrate   - Migrate data from JSON files');
    console.log('  npm run migrate-data validate  - Validate migration results');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { DataMigrationService };
