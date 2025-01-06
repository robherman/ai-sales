import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GreetingEntity } from '../entities/greeting.entity';
import { ContextInfo } from '../../../context-manager/src/interfaces/context.interface';
import { AiService } from '../../../ai-core/src';
import { BedrockModel } from '../../../ai-core/src/const/models.const';

@Injectable()
export class GreetingsService {
  private logger = new Logger();

  constructor(
    @InjectRepository(GreetingEntity)
    private greetingRepository: Repository<GreetingEntity>,
    private aiService: AiService,
  ) {}

  async getGreetings(): Promise<GreetingEntity[]> {
    const greetings = await this.greetingRepository.find({
      where: { isActive: true },
      order: { priority: 'DESC' },
    });

    return greetings;
  }

  async getGreetingMessage(context: Record<string, any>): Promise<string> {
    this.logger.debug(`Generating Greeting message`);
    const greetings = await this.greetingRepository.find({
      where: { isActive: true },
      order: { priority: 'DESC' },
    });

    for (const greeting of greetings) {
      if (this.matchesConditions(greeting.conditions || {}, context)) {
        const template = this.renderGreeting(greeting.content, context);
        return this.generateAIGreeting(template, context);
      }
    }

    return await this.generateAIGreeting(
      `Hola {customerContactName}, en que puedo ayudarte hoy?`,
    );
  }

  private async generateAIGreeting(
    template: string,
    context?: Record<string, any>,
  ): Promise<string> {
    const greetingAi = await this.aiService.generateResponse({
      model: BedrockModel.CLAUDE_3_HAIKU,
      temperature: 0,
      maxTokens: 100,
      messages: [
        {
          role: 'system',
          content: `Genere un saludo para un cliente utilizando este formato: "${template || '-'}". 
Genere únicamente el saludo, nada más. Sea conciso en su respuesta. 
Este es el saludo inicial de una conversación.`,
        },
        {
          role: 'user',
          content: `Aquí está la información de contexto que tiene para generar el saludo, reemplazando los valores.\y ${JSON.stringify(context)}`,
        },
      ],
    });
    return greetingAi.content;
  }

  private matchesConditions(
    conditions: Record<string, any>,
    context: Record<string, any>,
  ): boolean {
    for (const [key, value] of Object.entries(conditions)) {
      if (context[key] !== value) {
        return false;
      }
    }
    return true;
  }

  private renderGreeting(
    content: string,
    context: Record<string, any>,
  ): string {
    return content.replace(
      /\\{\\{(\\w+)\\}\\}/g,
      (match, key) => context[key] || match,
    );
  }

  private getDefaultGreeting(): string {
    return 'Welcome! How can I assist you today?';
  }

  async createGreeting(data: Partial<GreetingEntity>): Promise<GreetingEntity> {
    const greeting = this.greetingRepository.create(data);
    return this.greetingRepository.save(greeting);
  }

  async updateGreeting(
    id: string,
    data: Partial<GreetingEntity>,
  ): Promise<GreetingEntity> {
    await this.greetingRepository.update(id, data);
    return this.greetingRepository.findOneOrFail({ where: { id } });
  }
}
