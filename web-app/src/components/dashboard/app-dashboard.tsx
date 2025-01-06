"use client";

import { useState, useEffect } from "react";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import DashboardStats from "./dashboard-stats";
import DashboardTopBar from "./dashboard-top-bar";
import ChatBubbleLeftEllipsisIcon from "@heroicons/react/24/outline/ChatBubbleLeftEllipsisIcon";
import TokenAnalyticsDashboard from "../token-analytics";
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
import { getChatsAnalytcs } from "../../lib/chat/actions";
import { formatNumber } from "../../lib/utils";

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

export default function AppDashboard() {
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

  const formatLatency = (ms: number) => {
    if (ms < 1000) return `${formatNumber(ms)} ms`;
    return `${formatNumber(ms / 1000)} s`;
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
      {/* <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} /> */}
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

      <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats
          title={`Total Chats`}
          value={formatNumber(analytics?.analytics.totalChats || 0)}
          icon={<ChatBubbleLeftEllipsisIcon className="h-8 w-8" />}
          description={``}
          colorIndex={1}
        />
        <DashboardStats
          title={`Message Count`}
          value={analytics?.tokenUsage.messageCount}
          icon={<ChatBubbleLeftEllipsisIcon className="h-8 w-8" />}
          description={``}
          colorIndex={2}
        />
        <DashboardStats
          title={`Total Tokens`}
          value={formatNumber(analytics?.tokenUsage.totalTokens || 0)}
          icon={<ChatBubbleLeftEllipsisIcon className="h-8 w-8" />}
          description={``}
          colorIndex={3}
        />
        <DashboardStats
          title={`Average Total Tokens`}
          value={formatNumber(analytics?.tokenUsage.averageTotalTokens || 0)}
          icon={<ChatBubbleLeftEllipsisIcon className="h-8 w-8" />}
          description={``}
          colorIndex={4}
        />
        <DashboardStats
          title={`Average Input Tokens`}
          value={formatNumber(analytics?.tokenUsage.averageInputTokens || 0)}
          icon={<ChatBubbleLeftEllipsisIcon className="h-8 w-8" />}
          description={``}
          colorIndex={5}
        />
        <DashboardStats
          title={`Average Output Tokens`}
          value={formatNumber(analytics?.tokenUsage.averageOutputTokens || 0)}
          icon={<ChatBubbleLeftEllipsisIcon className="h-8 w-8" />}
          description={``}
          colorIndex={6}
        />
        <DashboardStats
          title={`Average Message Length`}
          value={formatNumber(analytics?.analytics.averageLength || 0)}
          icon={<ChatBubbleLeftEllipsisIcon className="h-8 w-8" />}
          description={``}
          colorIndex={7}
        />
        <DashboardStats
          title={`Average Message/Chat`}
          value={formatNumber(analytics?.analytics.averageMessagesPerChat || 0)}
          icon={<ChatBubbleLeftEllipsisIcon className="h-8 w-8" />}
          description={``}
          colorIndex={1}
        />
        <DashboardStats
          title={`Average Latency`}
          value={formatLatency(0)}
          icon={<ChatBubbleLeftEllipsisIcon className="h-8 w-8" />}
          description={``}
          colorIndex={1}
        />
      </div>

      <div className="mt-2">{/* <TokenAnalyticsDashboard /> */}</div>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Token Usage Chart</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
}
