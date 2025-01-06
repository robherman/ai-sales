import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';

interface WooCommerceBuildCartDto {
  products: { itemCode: string; salPackUnQuantity: number }[];
}

export interface WooCommerceBuildCartResponse {
  cartUrl: string;
}

interface WooCommerceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

@Injectable()
export class ShoppingCartWooCommerceService {
  private readonly logger = new Logger(ShoppingCartWooCommerceService.name);

  private baseUrl: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.baseUrl = this.configService.get(`WOO_COMMERCE_URL`) || '';
  }

  async buildCartUrl(
    dto: WooCommerceBuildCartDto,
  ): Promise<WooCommerceResponse<WooCommerceBuildCartResponse>> {
    const response = await firstValueFrom(
      this.httpService
        .post(`${this.baseUrl}`, dto, {
          headers: { 'Content-type': 'application/json' },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new Error('Failed http call');
          }),
        ),
    );
    return response.data;
  }
}
