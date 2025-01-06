import { Injectable } from '@nestjs/common';
import { ICoreAppService } from '@lib/shared';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CoreAppProxyService implements ICoreAppService {
  constructor(private httpService: HttpService) {}

  async createUser(): Promise<any> {
    const response = await this.httpService
      .post('http://core-app/users', {})
      .toPromise();
    return response?.data;
  }

  async getUser(id: string): Promise<any> {
    const response = await this.httpService
      .get(`http://core-app/users/${id}`)
      .toPromise();
    return response?.data;
  }

  // ... other methods
}
