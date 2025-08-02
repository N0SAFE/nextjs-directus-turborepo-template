import { Injectable } from '@nestjs/common';
import { initTRPC } from '@trpc/server';
import { userRouter } from './routers/user';

const t = initTRPC.create();

@Injectable()
export class TrpcRouter {
  appRouter = t.router({
    user: userRouter,
  });
}

export type AppRouter = TrpcRouter['appRouter'];