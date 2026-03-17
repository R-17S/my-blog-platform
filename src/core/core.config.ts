import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { configValidationUtility } from '../setup/config-validation.utility';

@Injectable()
export class CoreConfig {
  @IsNotEmpty()
  port: number;

  @IsNotEmpty()
  mongoURI: string;

  @IsNotEmpty()
  accessTokenSecret: string;

  @IsNotEmpty()
  refreshTokenSecret: string;

  constructor(private configService: ConfigService<any, true>) {
    this.port = Number(this.configService.get('PORT'));
    this.mongoURI = this.configService.get('MONGO_URI');
    this.accessTokenSecret = this.configService.get('ACCESS_TOKEN_SECRET');
    this.refreshTokenSecret = this.configService.get('REFRESH_TOKEN_SECRET');

    configValidationUtility.validateConfig(this);
  }
}
