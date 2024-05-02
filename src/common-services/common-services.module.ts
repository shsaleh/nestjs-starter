import { Global, Module } from '@nestjs/common';
import { CommonServices } from './common-services.service';

@Global()
@Module({
  providers: [CommonServices],
  exports: [CommonServices],
})
export class CommonServicesModule {}
