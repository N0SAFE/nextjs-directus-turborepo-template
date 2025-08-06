import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { passkey } from "better-auth/plugins/passkey";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export const betterAuthFactory = (database: unknown) => {
    return {
        auth: betterAuth({
            database: drizzleAdapter(database as NodePgDatabase, {
                provider: "pg"
            }),
            emailAndPassword: {
                enabled: true
            },
            plugins: [
                passkey({
                    rpID: process.env.PASSKEY_RPID || "localhost",
                    rpName: process.env.PASSKEY_RPNAME || "NestJS Directus Turborepo Template",
                    origin: process.env.PASSKEY_ORIGIN || "http://localhost:3000"
                })
            ]
        }) as unknown as import("better-auth").Auth
    };
};

export const { auth } = betterAuthFactory(null);
