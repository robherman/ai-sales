"use client";

import { useState } from "react";

export function Tabs({
  tabs,
}: {
  tabs: { label: string; content: React.ReactNode }[];
}) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="tabs-boxed tabs mb-4">
        {tabs.map((tab, index) => (
          <a
            key={index}
            className={`tab ${activeTab === index ? "tab-active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </a>
        ))}
      </div>
      <div>{tabs[activeTab].content}</div>
    </div>
  );
}
