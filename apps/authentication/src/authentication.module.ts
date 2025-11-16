import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';
import { SharedConfigModule } from '@config/config.module';

@Module({
  imports: [
    SharedConfigModule.register({
      envFilePath: './apps/authentication/.env',
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI')!,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
})
export class AuthenticationModule {}
