import { Module } from '@nestjs/common';
import { Uploader } from '../../domain/forum/application/storage/uploader';
import { R2Storage } from './r2-storage';
import { EnvService } from '../env.service';

@Module({
  providers: [EnvService, { provide: Uploader, useClass: R2Storage }],
  exports: [Uploader],
})
export class StorageModule {}
