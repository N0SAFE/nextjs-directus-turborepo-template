import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './index';

async function runMigrate() {
  console.log('🔄 Running database migrations...');
  
  try {
    await migrate(db, {
      migrationsFolder: './src/db/migrations',
    });
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrate();