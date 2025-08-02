import { Injectable } from '@nestjs/common';
import { TrpcRouter } from './trpc.router';

@Injectable()
export class TrpcService {
  constructor(private readonly trpc: TrpcRouter) {}

  get appRouter() {
    return this.trpc.appRouter;
  }
}