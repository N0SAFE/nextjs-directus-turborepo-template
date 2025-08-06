import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: process.env.NODE_ENV !== 'production',
    bodyParser: false, // Disable NestJS body parser for oRPC
  });
  
  // Enable CORS for Next.js frontend
  app.enableCors({
    origin: process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  const port = process.env.API_PORT || 3005;
  await app.listen(port);
  console.log(`🚀 NestJS API with oRPC running on port ${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start the application:', error);
  process.exit(1);
});