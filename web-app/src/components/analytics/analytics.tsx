"use client";

import { useState, useEffect } from "react";
import { SentimentChart } from "./sentiment-chart";
import { TopicDistribution } from "./topic-distribution";
import { ConversionFunnel } from "./conversation-funnel";
import { ChatVolume } from "./chat-volume";
import { ResponseTimeAnalysis } from "./response-time-analysis";
import {
  calculateSentiments,
  identifyTopics,
  analyzeConversions,
  analyzeVolume,
  analyzeResponseTimes,
} from "@/lib/utils/analytics";
import { AppChat } from "../../lib/types";
import { getChats } from "../../lib/chat/actions";

export function ConversationAnalytics() {
  const [chats, setChats] = useState<AppChat[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    fetchChats();
  }, [dateRange]);

  const fetchChats = async () => {
    try {
      const response = await getChats();
      setChats(response);
      processAnalytics(response);
    } catch (error) {
      console.error("Error fetching chats:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const processAnalytics = (chats: AppChat[]) => {
    const data = {
      sentiments: calculateSentiments(chats),
      topics: identifyTopics(chats),
      conversions: analyzeConversions(chats),
      volume: analyzeVolume(chats),
      responseTimes: analyzeResponseTimes(chats),
    };
    setAnalyticsData(data);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <input
            type="date"
            className="input input-bordered"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
          />
          <input
            type="date"
            className="input input-bordered"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
          />
        </div>
      </div>

      {analyticsData ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Sentiment Analysis</h3>
              <SentimentChart data={analyticsData.sentiments} />
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Topic Distribution</h3>
              <TopicDistribution data={analyticsData.topics} />
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Conversion Funnel</h3>
              <ConversionFunnel data={analyticsData.conversions} />
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Chat Volume</h3>
              <ChatVolume data={analyticsData.volume} />
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl md:col-span-2">
            <div className="card-body">
              <h3 className="card-title">Response Time Analysis</h3>
              <ResponseTimeAnalysis data={analyticsData.responseTimes} />
            </div>
          </div>
        </div>
      ) : (
        <div>Loading analytics data...</div>
      )}
    </div>
  );
}
