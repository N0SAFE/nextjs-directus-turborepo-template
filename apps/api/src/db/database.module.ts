import { Module, Global } from "@nestjs/common";
import { DatabaseService } from "./services/database.service";
import { DATABASE_CONNECTION } from "./database-connection";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./drizzle/schema";

@Global()
@Module({
    providers: [
        DatabaseService,
        {
            provide: DATABASE_CONNECTION,
            useFactory: () => {
                const pool = new Pool({
                    connectionString: process.env.DATABASE_URL
                });
                return drizzle(pool, {
                    schema: schema
                });
            }
        }
    ],
    exports: [DatabaseService, DATABASE_CONNECTION]
})
export class DatabaseModule {}
