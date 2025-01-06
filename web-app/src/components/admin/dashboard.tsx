"use client";

import { useState, useEffect } from "react";

interface ChatStats {
  totalChats: number;
  activeUsers: number;
  averageResponseTime: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<ChatStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = {
        totalChats: 100,
        activeUsers: 500,
        averageResponseTime: 2,
      };
      setStats(data);
    };

    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="stat">
        <div className="stat-title">Total Chats</div>
        <div className="stat-value">{stats.totalChats}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Active Users</div>
        <div className="stat-value">{stats.activeUsers}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Avg. Response Time</div>
        <div className="stat-value">{stats.averageResponseTime}s</div>
      </div>
    </div>
  );
}
