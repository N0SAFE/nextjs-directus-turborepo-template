import { Module } from '@nestjs/common';
import { DevToolsController } from './devtools.controller';
import { DevToolsService } from './devtools.service';

@Module({
  controllers: [DevToolsController],
  providers: [DevToolsService],
  exports: [DevToolsService],
})
export class DevToolsModule {}