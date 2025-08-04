import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { onError, ORPCModule } from '@orpc/nest';
import { AuthModule } from '@mguay/nestjs-better-auth';
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { DATABASE_CONNECTION } from './db/database-connection';

@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    UserModule,
    AuthModule.forRootAsync({
      imports: [DatabaseModule],
      useFactory: (database: NodePgDatabase) => ({
        auth: betterAuth({
          database: drizzleAdapter(database, {
            provider: 'pg'
          }),
          emailAndPassword: {
            enabled: true,
          },
          trustedOrigins: [...[process.env.NEXT_PUBLIC_APP_URL].filter((url): url is string => !!url)],
        })
      }),
      inject: [DATABASE_CONNECTION],
    }),
    ORPCModule.forRoot({
      interceptors: [
        onError((error) => {
          console.error('oRPC Error:', error);
        }),
      ],
      eventIteratorKeepAliveInterval: 5000, // 5 seconds
    }),
  ],
})
export class AppModule {}