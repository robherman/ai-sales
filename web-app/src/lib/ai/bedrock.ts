import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { experimental_customProvider as customProvider } from "ai";

const bedrock = createAmazonBedrock({
  region: process.env.BEDROCK_AWS_REGION,
  accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY,
  // sessionToken: uuidv4(),
});

export const CHAT_BEDROCK = bedrock(
  "anthropic.claude-3-5-sonnet-20240620-v1:0",
  {
    //   additionalModelRequestFields: { top_k: 350 },
  },
);

export const EMBEDDING_BEDROCK = bedrock.embedding(
  "amazon.titan-embed-text-v2:0",
  {
    dimensions: 512,
    normalize: true,
  },
);

export const BEDROCK_MODELS = customProvider({
  languageModels: {
    opus: bedrock("antrophic.claude-3-opus-20240229-v1:0"),
    sonnet: bedrock("anthropic.claude-3-sonnet-20240229-v1:0"),
    haiku: bedrock("anthropic.claude-3-haiku-20240307-v1:0"),
  },
  textEmbeddingModels: {
    emdedding: EMBEDDING_BEDROCK,
  },
  fallbackProvider: bedrock,
});
