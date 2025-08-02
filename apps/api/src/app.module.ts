import { Module } from '@nestjs/common';
import { TrpcModule } from './trpc/trpc.module';
import { DatabaseModule } from './db/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, TrpcModule, AuthModule],
})
export class AppModule {}