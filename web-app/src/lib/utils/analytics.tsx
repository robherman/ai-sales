import { AppChat, ChatMessage } from "../types";

export function calculateSentiments(chats: AppChat[]): {
  positive: number;
  neutral: number;
  negative: number;
} {
  // This is a simplified sentiment analysis. In a real-world scenario, you'd use a more sophisticated NLP model.
  const sentiments = { positive: 0, neutral: 0, negative: 0 };
  const totalMessages = chats.reduce(
    (acc, chat) => acc + chat.messages.length,
    0,
  );

  chats.forEach((chat) => {
    chat.messages.forEach((message: ChatMessage) => {
      if (message.role === "human") {
        const sentiment = simpleSentimentAnalysis(message.content);
        sentiments[sentiment]++;
      }
    });
  });

  return {
    positive: Math.round((sentiments.positive / totalMessages) * 100),
    neutral: Math.round((sentiments.neutral / totalMessages) * 100),
    negative: Math.round((sentiments.negative / totalMessages) * 100),
  };
}

function simpleSentimentAnalysis(
  text: string,
): "positive" | "neutral" | "negative" {
  const positiveWords = ["great", "good", "excellent", "happy", "satisfied"];
  const negativeWords = ["bad", "poor", "terrible", "unhappy", "disappointed"];

  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter((word) =>
    lowerText.includes(word),
  ).length;
  const negativeCount = negativeWords.filter((word) =>
    lowerText.includes(word),
  ).length;

  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
}

export function identifyTopics(
  chats: AppChat[],
): { name: string; value: number }[] {
  // This is a simplified topic identification. In a real-world scenario, you'd use more advanced NLP techniques.
  const topics: Record<string, number> = {};
  const topicKeywords: Record<string, string[]> = {
    "Product Inquiries": ["product", "item", "stock", "available"],
    "Support Issues": ["help", "problem", "issue", "not working"],
    "Pricing Questions": ["price", "cost", "discount", "offer"],
  };

  chats.forEach((chat) => {
    chat.messages.forEach((message) => {
      if (message.role === "human") {
        const lowerContent = message.content.toLowerCase();
        for (const [topic, keywords] of Object.entries(topicKeywords)) {
          if (keywords.some((keyword) => lowerContent.includes(keyword))) {
            topics[topic] = (topics[topic] || 0) + 1;
            break; // Assign only one topic per message
          }
        }
      }
    });
  });

  const totalTopics = Object.values(topics).reduce((a, b) => a + b, 0);
  const result = Object.entries(topics).map(([name, value]) => ({
    name,
    value: Math.round((value / totalTopics) * 100),
  }));

  // Add 'Other' category if needed
  const sumPercentages = result.reduce((sum, item) => sum + item.value, 0);
  if (sumPercentages < 100) {
    result.push({ name: "Other", value: 100 - sumPercentages });
  }

  return result;
}

export function analyzeConversions(
  chats: AppChat[],
): { name: string; value: number }[] {
  const stages = ["Initiated", "Engaged", "Considered", "Converted"];
  const counts: Record<string, any> = {
    Initiated: chats.length,
    Engaged: 0,
    Considered: 0,
    Converted: 0,
  };

  chats.forEach((chat) => {
    const messageCount = chat.messages.length;
    if (messageCount > 2) counts.Engaged++;
    if (messageCount > 5) counts.Considered++;
    if (chat.additionalMetadata?.converted) counts.Converted++;
  });

  return stages.map((stage) => ({ name: stage, value: counts[stage] }));
}

export function analyzeVolume(
  chats: AppChat[],
): { date: string; value: number }[] {
  const volumeByDate: Record<string, number> = {};

  chats.forEach((chat) => {
    const date = new Date(chat.createdAt).toISOString().split("T")[0];
    volumeByDate[date] = (volumeByDate[date] || 0) + 1;
  });

  return Object.entries(volumeByDate).map(([date, value]) => ({ date, value }));
}

export function analyzeResponseTimes(chats: AppChat[]): {
  averageResponseTime: string;
  responseTimeDistribution: { range: string; percentage: number }[];
} {
  const responseTimes: number[] = [];

  chats.forEach((chat) => {
    let lastUserMessageTime: Date | null = null;
    chat.messages.forEach((message) => {
      if (message.role === "human") {
        lastUserMessageTime = new Date(message.createdAt);
      } else if (message.role === "ai" && lastUserMessageTime) {
        const responseTime =
          new Date(message.createdAt).getTime() - lastUserMessageTime.getTime();
        responseTimes.push(responseTime);
        lastUserMessageTime = null;
      }
    });
  });

  const averageResponseTime = calculateAverageResponseTime(responseTimes);
  const distribution = calculateResponseTimeDistribution(responseTimes);

  return {
    averageResponseTime,
    responseTimeDistribution: distribution,
  };
}

function calculateAverageResponseTime(responseTimes: number[]): string {
  const averageMs =
    responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  const minutes = Math.floor(averageMs / 60000);
  const seconds = ((averageMs % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

function calculateResponseTimeDistribution(
  responseTimes: number[],
): { range: string; percentage: number }[] {
  const ranges = [
    { max: 60000, label: "0-1m" },
    { max: 180000, label: "1-3m" },
    { max: 300000, label: "3-5m" },
    { max: Infinity, label: "5m+" },
  ];

  const distribution = ranges.map((range) => ({
    range: range.label,
    count: 0,
  }));

  responseTimes.forEach((time) => {
    const rangeIndex = ranges.findIndex((range) => time < range.max);
    distribution[rangeIndex].count++;
  });

  const total = responseTimes.length;
  return distribution.map((item) => ({
    range: item.range,
    percentage: Math.round((item.count / total) * 100),
  }));
}
