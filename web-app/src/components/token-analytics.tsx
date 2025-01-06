import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getChatsAnalytcs } from "../lib/chat/actions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface TokenAnalytics {
  tokenUsage: {
    totalInputTokens: number;
    totalOutputTokens: number;
    totalTokens: number;
    messageCount: number;
    averageInputTokens: number;
    averageOutputTokens: number;
    averageTotalTokens: number;
  };
  //    metrics: any;
  analytics: {
    averageLength: number;
    totalChats: number;
    totalMessages: number;
    averageMessagesPerChat: number;
  };
}

const TokenAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<TokenAnalytics | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // Set initial date range to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setStartDate(formatDate(firstDay));
    setEndDate(formatDate(lastDay));
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchAnalytics();
    }
  }, [startDate, endDate]);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchAnalytics = async () => {
    try {
      const response = await getChatsAnalytcs(startDate, endDate);
      setAnalytics(response);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const chartData = {
    labels: ["Input Tokens", "Output Tokens", "Total Tokens"],
    datasets: [
      {
        label: "Token Usage",
        data: analytics
          ? [
              analytics.tokenUsage?.averageInputTokens,
              analytics.tokenUsage?.averageOutputTokens,
              analytics.tokenUsage?.averageTotalTokens,
            ]
          : [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">
        Token Usage Analytics Dashboard
      </h1>

      <div className="mb-4 flex space-x-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="input input-bordered"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="input input-bordered"
        />
        <button onClick={fetchAnalytics} className="btn btn-primary">
          Fetch Analytics
        </button>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Message Count</h2>
              <p className="text-3xl font-bold">
                {analytics.tokenUsage?.messageCount}
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Total Tokens</h2>
              <p className="text-3xl font-bold">
                {analytics.tokenUsage?.totalTokens}
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Average Total Tokens</h2>
              <p className="text-3xl font-bold">
                {analytics.tokenUsage?.averageTotalTokens.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Average Input Tokens</h2>
              <p className="text-3xl font-bold">
                {analytics.tokenUsage?.averageInputTokens.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Average Output Tokens</h2>
              <p className="text-3xl font-bold">
                {analytics.tokenUsage?.averageOutputTokens.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Average Message Length</h2>
              <p className="text-3xl font-bold">
                {analytics.analytics?.averageLength.toFixed(2)} characters
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Average Message/Chat</h2>
              <p className="text-3xl font-bold">
                {analytics.analytics?.averageMessagesPerChat.toFixed(2)} ms
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Token Usage Chart</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default TokenAnalyticsDashboard;
