import { promises as fs } from 'fs';
import path from 'path';
import { Filament } from '../types/filament';
import { databaseService } from '../services/database';

const JSON_FILE = path.join(__dirname, '../../data/filaments.json');

async function migrateToSQLite(): Promise<void> {
  try {
    console.log('🔄 Starting migration from JSON to SQLite...');

    // Check if JSON file exists
    try {
      await fs.access(JSON_FILE);
    } catch {
      console.log('ℹ️  No existing JSON file found, starting with empty database');
      return;
    }

    // Read existing JSON data
    const jsonData = await fs.readFile(JSON_FILE, 'utf-8');
    const filaments: Filament[] = JSON.parse(jsonData);

    if (filaments.length === 0) {
      console.log('ℹ️  No filaments found in JSON file');
      return;
    }

    console.log(`📊 Found ${filaments.length} filaments in JSON file`);

    // Import to SQLite
    await databaseService.importFromJSON(filaments);

    // Verify migration
    const importedCount = await databaseService.getTotalFilaments();
    console.log(`✅ Successfully migrated ${importedCount} filaments to SQLite`);

    // Create backup of JSON file
    const backupFile = JSON_FILE + '.backup';
    await fs.copyFile(JSON_FILE, backupFile);
    console.log(`💾 Created backup: ${backupFile}`);

    // Optionally remove original JSON file (uncomment if you want to delete it)
    // await fs.unlink(JSON_FILE);
    // console.log('🗑️  Removed original JSON file');

    console.log('🎉 Migration completed successfully!');
    console.log('📝 You can now safely add *.json files to .gitignore');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateToSQLite()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateToSQLite };
