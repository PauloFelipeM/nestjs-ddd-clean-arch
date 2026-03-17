import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { EnvService } from 'src/infra/env.service';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(envService: EnvService) {
    super({
      host: envService.get('REDIS_HOST') as string,
      port: envService.get('REDIS_PORT') as number,
      db: envService.get('REDIS_DB') as number,
    });
  }

  onModuleDestroy() {
    this.disconnect();
  }
}
