import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileProviders } from './dto/file.provider';
import { DatabaseModule } from 'src/db/db.module';

@Module({
  imports: [DatabaseModule],
  providers: [StorageService, ...FileProviders],
  controllers: [],
  exports: [StorageService],
})
export class StorageModule {}
