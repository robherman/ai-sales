import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromptTemplateEntity } from './entites/prompt-template.entity';

@Injectable()
export class PromptsService {
  constructor(
    @InjectRepository(PromptTemplateEntity)
    private promptTemplateRepository: Repository<PromptTemplateEntity>,
  ) {}

  async getPrompts(): Promise<PromptTemplateEntity[]> {
    return this.promptTemplateRepository.find({
      where: { isActive: true },
    });
  }

  async getPromptTemplate(id: string): Promise<PromptTemplateEntity> {
    return this.promptTemplateRepository.findOneOrFail({
      where: { id, isActive: true },
    });
  }

  async createPromptTemplate(
    data: Partial<PromptTemplateEntity>,
  ): Promise<PromptTemplateEntity> {
    const promptTemplate = this.promptTemplateRepository.create(data);
    return this.promptTemplateRepository.save(promptTemplate);
  }

  async updatePromptTemplate(
    id: string,
    data: Partial<PromptTemplateEntity>,
  ): Promise<PromptTemplateEntity> {
    await this.promptTemplateRepository.update(id, data);
    return this.getPromptTemplate(id);
  }

  async renderPrompt(
    id: string,
    context: Record<string, any>,
  ): Promise<string> {
    const template = await this.getPromptTemplate(id);
    if (!template) {
      throw new Error(`Prompt template "${id}" not found`);
    }
    return this.preparePrompt(template.content, context);
  }

  private render(
    template: PromptTemplateEntity,
    context: Record<string, any>,
  ): string {
    let formatted = template.content;
    for (const [key, value] of Object.entries(template.variables || {})) {
      const contextValue = context[key] || value;
      const stringValue = this.convertToString(contextValue);
      formatted = formatted.replace(new RegExp(`[[${key}]]`, 'g'), stringValue);
    }
    return formatted;
  }

  private replaceVariable(
    text: string,
    varName: string,
    value: any,
    fallback = '',
  ) {
    const pattern = new RegExp(`\\[\\[${varName}\\]\\]`, 'g');
    let replacement;

    if (typeof value === 'object' && value !== null) {
      // If it's an object, we'll create a formatted string
      replacement = Object.entries(value)
        .map(([key, val]) => `${key}: ${this.convertToString(val)}`)
        .join('\n');
    } else {
      replacement = this.convertToString(value);
    }

    return text.replace(pattern, replacement || fallback);
  }

  private processConditionals(text: string, variables: Record<string, any>) {
    const conditionalPattern =
      /\{\{(if|else if|else)\s*([^}]*)\}\}([\s\S]*?)(?=\{\{(?:else|else if|\/if)\}\}|\{\{\/if\}\})|(\{\{\/if\}\})/g;
    return text.replace(/\{\{if[\s\S]*?\{\{\/if\}\}/g, (match) => {
      let result = '';
      let condition;
      let content;
      let hasMatched = false;

      const parts = match.match(conditionalPattern);
      for (const part of parts || []) {
        const [, type, cond, text] =
          part.match(/\{\{(if|else if|else)\s*([^}]*)\}\}([\s\S]*?)$/) || [];

        if (type === 'if' || type === 'else if') {
          condition = cond.trim();
          content = text;
          if (!hasMatched && this.evaluateCondition(condition, variables)) {
            result = content;
            hasMatched = true;
          }
        } else if (type === 'else') {
          if (!hasMatched) {
            result = text;
          }
        }
      }

      return result;
    });
  }

  private evaluateCondition(
    condition: string,
    variables: Record<string, any>,
  ): boolean {
    if (!condition) return true; // For 'else' case
    // This is a simple evaluation. You might want to use a proper expression evaluator for complex conditions.
    const parts = condition.split(/\s+/);
    if (parts.length === 1) {
      return !!this.getNestedValue(variables, parts[0]);
    }
    if (parts.length === 3) {
      const [left, operator, right] = parts;
      const leftValue = this.getNestedValue(variables, left);
      const rightValue = this.getNestedValue(variables, right);
      switch (operator) {
        case '==':
          return leftValue == rightValue;
        case '!=':
          return leftValue != rightValue;
        case '>':
          return leftValue > rightValue;
        case '<':
          return leftValue < rightValue;
        case '>=':
          return leftValue >= rightValue;
        case '<=':
          return leftValue <= rightValue;
      }
    }
    return false;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((value, key) => value && value[key], obj);
  }

  private preparePrompt(template: string, variables: Record<string, any>) {
    let processed = this.processConditionals(template, variables);
    processed = this.replaceNestedVariables(processed, variables);
    return processed;
  }

  private replaceNestedVariables(text: string, variables: Record<string, any>) {
    const pattern = /\[\[([^\]]+)\]\]/g;
    return text.replace(pattern, (match, path) => {
      const value = this.getNestedValue(variables, path);
      return this.convertToString(value);
    });
  }

  private convertToString(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value === null || value === undefined) {
      return '';
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.convertToString(item)).join('\n');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }
}
