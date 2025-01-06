"use client";

import { useState, useEffect } from "react";

interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setNotifications([]);
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="toast toast-end">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`alert alert-${notification.type}`}
        >
          <div>
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="btn btn-sm"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}
