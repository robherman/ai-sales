import { AppChat } from "../../lib/types";
import { formatNumber } from "../../lib/utils";

export const ChatInfo = ({
  stats,
}: {
  stats?: {
    totalMessages: number;
    totalInputTokens: number;
    totalOutputTokens: number;
    totalTokens: number;
    messageCount: number;
    averageInputTokens: number;
    averageOutputTokens: number;
    averageTotalTokens: number;
  };
}) => {
  return (
    <div className="mt-4 rounded-lg bg-base-200 p-4 shadow">
      <h3 className="mb-3 text-lg font-bold text-primary">Métricas del Chat</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded bg-base-100 p-2">
          <p className="text-xs text-secondary">Mensajes</p>
          <p className="text-sm font-semibold">
            {formatNumber(stats?.totalMessages || 0)}
          </p>
        </div>
        <div className="rounded bg-base-100 p-2">
          <p className="text-xs text-secondary">Tokens</p>
          <p className="text-sm font-semibold">
            {formatNumber(stats?.totalTokens || 0)}
          </p>
        </div>
        <div className="rounded bg-base-100 p-2">
          <p className="text-xs text-secondary">Input</p>
          <p className="text-sm font-semibold">
            {formatNumber(stats?.averageInputTokens || 0)}
          </p>
        </div>
        <div className="rounded bg-base-100 p-2">
          <p className="text-xs text-secondary">Output</p>
          <p className="text-sm font-semibold">
            {formatNumber(stats?.averageOutputTokens || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};
