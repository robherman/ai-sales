import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  temperature: parseFloat(process.env.AI_TEMPERATURE || '') || 0,
  defaultModel:
    process.env.AI_DEFAULT_MODEL || 'anthropic.claude-3-sonnet-20240229-v1:0',
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '', 10) || 2000,
  topK: parseInt(process.env.AI_TOP_K || '3', 10) || 5,
  topP: parseFloat(process.env.AI_TOP_P || '0.8') || 0.8,
  bedrock: {
    region: process.env.BEDROCK_AWS_REGION,
    accessKey: process.env.BEDROCK_AWS_ACCESSKEY,
    secretKey: process.env.BEDROCK_AWS_SECRETKEY,
  },
}));
