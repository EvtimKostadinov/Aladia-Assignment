import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NetworkingModule } from '@core/networking/networking.module';

@Module({
  imports: [NetworkingModule],
  controllers: [AuthController],
})
export class AuthModule {}
