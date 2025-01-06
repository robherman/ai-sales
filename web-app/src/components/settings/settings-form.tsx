"use client";

import { useState } from "react";
import VersionInfo from "../version-info";

export default function SettingsForm() {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Theme</span>
        </label>
        <select
          className="select select-bordered"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Enable Notifications</span>
          <input
            type="checkbox"
            className="toggle"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
          />
        </label>
      </div>
      <div className="form-control">
        <VersionInfo />
      </div>
      <button type="submit" className="btn btn-primary">
        Save Settings
      </button>
    </form>
  );
}
