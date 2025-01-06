import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    const result = dotenv.config();
    // this.envConfig = result.error ? process.env : result.parsed;
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
