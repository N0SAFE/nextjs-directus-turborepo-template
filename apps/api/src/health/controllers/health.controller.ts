import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { healthContract } from '../contracts/health.contract';
import { HealthService } from '../services/health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Implement the entire health contract
   */
  @Implement(healthContract)
  health() {
    return {
      // Basic health check
      check: implement(healthContract.check).handler(async () => {
        return await this.healthService.getHealth();
      }),

      // Readiness check
      ready: implement(healthContract.ready).handler(async () => {
        return await this.healthService.getReadiness();
      }),

      // Liveness check
      live: implement(healthContract.live).handler(async () => {
        return await this.healthService.getLiveness();
      }),

      // Detailed health check
      detailed: implement(healthContract.detailed).handler(async () => {
        return await this.healthService.getDetailedHealth();
      }),
    };
  }
}
