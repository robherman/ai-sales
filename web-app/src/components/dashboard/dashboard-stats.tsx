function DashboardStats({ title, icon, value, description, colorIndex }: any) {
  const COLORS = ["primary", "secondary"];

  const getDescStyle = () => {
    if (description.includes("↗︎")) return "font-bold text-green-300";
    else if (description.includes("↙")) return "font-bold text-red-400";
    else return "";
  };

  return (
    <div className="stats overflow-hidden shadow">
      <div className="stat">
        <div className={`stat-figure text-${COLORS[colorIndex % 2]}`}>
          {icon}
        </div>
        <div className="stat-title">{title}</div>
        <div className={`stat-value text-${COLORS[colorIndex % 2]}`}>
          {value}
        </div>
        <div className={"stat-desc " + getDescStyle()}>{description}</div>
      </div>
    </div>
  );
}

export default DashboardStats;
