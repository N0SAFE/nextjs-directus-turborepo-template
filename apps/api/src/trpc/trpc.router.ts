import { Injectable } from '@nestjs/common';
import { userRouter } from './routers/user';

@Injectable()
export class TrpcRouter {
  appRouter = userRouter;
}

export type AppRouter = typeof userRouter;