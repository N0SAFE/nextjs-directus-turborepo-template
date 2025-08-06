import { sql } from 'drizzle-orm';
import { db } from './index';

async function reset() {
  console.log('🔄 Resetting database...');

  try {
    // Drop all tables
    await db.execute(sql`DROP SCHEMA public CASCADE`);
    await db.execute(sql`CREATE SCHEMA public`);
    await db.execute(sql`GRANT ALL ON SCHEMA public TO postgres`);
    await db.execute(sql`GRANT ALL ON SCHEMA public TO public`);
    
    console.log('✅ Database reset completed');
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

reset();