import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

interface SharedConfigModuleOptions {
  envFilePath: string;
  validationSchema: Joi.ObjectSchema;
}

@Module({})
export class SharedConfigModule {
  static register(options: SharedConfigModuleOptions): DynamicModule {
    return {
      module: SharedConfigModule,
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          envFilePath: options.envFilePath,
          validationSchema: options.validationSchema,
        }),
      ],
      exports: [NestConfigModule],
    };
  }
}
