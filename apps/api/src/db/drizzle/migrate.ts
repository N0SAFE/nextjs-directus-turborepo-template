import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './index';

async function runMigrate() {
  console.log('🔄 Running database migrations...');
  
  try {
    await migrate(db, {
      migrationsFolder: './src/db/drizzle/migrations',
    });
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrate();