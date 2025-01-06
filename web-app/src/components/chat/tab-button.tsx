"use client";

export function TabButton({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center space-x-2 rounded p-2 ${
        active ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
