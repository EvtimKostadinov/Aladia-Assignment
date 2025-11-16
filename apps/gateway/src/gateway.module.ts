import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { NetworkingModule } from '@core/networking/networking.module';
import { SharedConfigModule } from '@config/config.module';

@Module({
  imports: [
    SharedConfigModule.register({
      envFilePath: './apps/gateway/.env',
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        AUTH_SERVICE_HOST: Joi.string().required(),
        AUTH_SERVICE_PORT: Joi.number().required(),
      }),
    }),
    AuthModule,
    NetworkingModule,
  ],
})
export class GatewayModule {}
