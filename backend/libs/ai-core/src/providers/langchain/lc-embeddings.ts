import { BedrockEmbeddings } from '@langchain/aws';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BedrockModel } from '../../const/models.const';

@Injectable()
export class LcEmbeddingService implements OnModuleInit {
  private embedding: BedrockEmbeddings;
  private logger = new Logger(LcEmbeddingService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.init();
  }

  private init() {
    this.embedding = new BedrockEmbeddings({
      region: this.configService.get('ai.bedrock.region'),
      credentials: {
        accessKeyId: this.configService.get('ai.bedrock.accessKey')!,
        secretAccessKey: this.configService.get('ai.bedrock.secretKey')!,
      },
      model: BedrockModel.TITAN_EMBEDDING_V1,
    });
  }

  get Instance() {
    return this.embedding;
  }

  async embed(value: string) {
    this.logger.debug(`Embedding`, { value });
    const singleVector = await this.embedding.embedQuery(value);
    return singleVector;
  }

  async embedMany(values: string[]) {
    this.logger.debug(`Embedding docs`, values.length);
    const vectors = await this.embedding.embedDocuments(values);
    return vectors;
  }

  async similarity(input: string, compare: string[]) {
    return 0;
  }
}
