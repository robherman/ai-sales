import { Injectable, Logger } from '@nestjs/common';
import { RecommendationsService } from '../../../recommendations/src';
import { z } from 'zod';
import { tool } from '@langchain/core/tools';

@Injectable()
export class RecommendationsTool {
  private logger = new Logger(RecommendationsTool.name);

  constructor(private recommendationsService: RecommendationsService) {}

  createLcTool() {
    const lcTool = tool(
      async ({ customerId }) => {
        return this.execute({ customerId });
      },
      {
        name: 'recomendar_productos',
        description: 'Obtener recomendaciones de productos para un cliente.',
        schema: z.object({
          customerId: z.string({
            description: 'Id del cliente',
          }),
        }),
      },
    );
    return lcTool;
  }

  async run(params: any) {
    return this.execute(params);
  }

  private async execute({
    customerId,
  }: {
    customerId: string;
  }): Promise<string> {
    try {
      this.logger.debug(`Running tool`, { customerId });
      const recommendations =
        await this.recommendationsService.getRecommendations(customerId);
      return `Estas son las recomendaciones encontradas: 
      ${JSON.stringify(recommendations, null, 2)}`;
    } catch (error) {
      this.logger.error(`Failed to generate recommendations`, error);
      return JSON.stringify({
        error: `No se pudo generar recomendaciones para el cliente`,
        success: false,
      });
    }
  }
}
