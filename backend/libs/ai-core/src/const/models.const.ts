export enum BedrockModel {
  // Anthropic models
  CLAUDE_3_5_SONNET = 'anthropic.claude-3-5-sonnet-20240620-v1:0',
  CLAUDE_3_SONNET = 'anthropic.claude-3-sonnet-20240229-v1:0',
  CLAUDE_3_HAIKU = 'anthropic.claude-3-haiku-20240307-v1:0',
  CLAUDE_2_1 = 'anthropic.claude-v2:1',
  CLAUDE_INSTANT_1_2 = 'anthropic.claude-instant-v1',

  // AI21 Labs models
  JURASSIC_2_ULTRA = 'ai21.j2-ultra-v1',
  JURASSIC_2_MID = 'ai21.j2-mid-v1',

  // Stability AI models
  STABLE_DIFFUSION_XL = 'stability.stable-diffusion-xl-v1',

  // Amazon models
  TITAN_TEXT_EXPRESS_V1 = 'amazon.titan-text-express-v1',
  TITAN_TEXT_LITE_V1 = 'amazon.titan-text-lite-v1',
  TITAN_EMBEDDING_V1 = 'amazon.titan-embed-text-v1',
  TITAN_EMBEDDING_V2 = 'amazon.titan-embed-text-v2:0',
  TITAN_IMAGE_GENERATOR_V1 = 'amazon.titan-image-generator-v1',

  // Cohere models
  COMMAND_TEXT = 'cohere.command-text-v14',
  COMMAND_LIGHT_TEXT = 'cohere.command-light-text-v14',
  EMBED_ENGLISH = 'cohere.embed-english-v3',
  EMBED_MULTILINGUAL = 'cohere.embed-multilingual-v3',

  // Meta models
  LLAMA2_13B = 'meta.llama2-13b-chat-v1',
  LLAMA2_70B = 'meta.llama2-70b-chat-v1',
}

// const BedrockModel = {
//   // Anthropic models
//   CLAUDE: 'anthropic.claude-v2',
//   CLAUDE_INSTANT: 'anthropic.claude-instant-v1',

//   // AI21 Labs models
//   JURASSIC_2_ULTRA: 'ai21.j2-ultra-v1',
//   JURASSIC_2_MID: 'ai21.j2-mid-v1',

//   // Stability AI models
//   STABLE_DIFFUSION: 'stability.stable-diffusion-xl-v0',

//   // Amazon models
//   TITAN_TEXT: 'amazon.titan-text-express-v1',
//   TITAN_EMBEDDING: 'amazon.titan-embed-text-v1',

//   // Cohere models
//   COMMAND: 'cohere.command-text-v14',
//   EMBED: 'cohere.embed-english-v3',

//   // Meta models
//   LLAMA2_13B: 'meta.llama2-13b-chat-v1',
//   LLAMA2_70B: 'meta.llama2-70b-chat-v1'
// } as const;

// type BedrockModelType = typeof BedrockModel[keyof typeof BedrockModel];
