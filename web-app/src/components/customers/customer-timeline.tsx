"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "../loading-spinner";
import {
  ChatBubbleLeftIcon,
  EnvelopeIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

interface Activity {
  type: "order" | "chat" | "email";
  date: string;
  description: string;
}

export function CustomerTimeline({ customerId }: { customerId: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      // Replace this with your actual API call
      const mockActivities: Activity[] = [
        {
          type: "order",
          date: "2023-05-01",
          description: "Placed order #12345",
        },
        {
          type: "chat",
          date: "2023-04-28",
          description: "Customer support chat",
        },
        {
          type: "email",
          date: "2023-04-25",
          description: "Sent promotional email",
        },
      ];

      setActivities(mockActivities);
      setIsLoading(false);
    }

    fetchActivities();
  }, [customerId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Activity Timeline</h2>
        <ul className="timeline timeline-vertical">
          {activities.map((activity, index) => (
            <li key={index}>
              <div className="timeline-start">{activity.date}</div>
              <div className="timeline-middle">
                {activity.type === "order" && (
                  <ShoppingBagIcon className="h-4 w-4" />
                )}
                {activity.type === "chat" && (
                  <ChatBubbleLeftIcon className="h-4 w-4" />
                )}
                {activity.type === "email" && (
                  <EnvelopeIcon className="h-4 w-4" />
                )}
              </div>
              <div className="timeline-end">{activity.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
