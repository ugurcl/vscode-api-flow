import { useState } from "react";
import { useResponseStore } from "../../store/response.store";
import { StatusBadge } from "../shared/StatusBadge";
import { TabBar } from "./TabBar";
import { ResponseBody } from "./ResponseBody";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function ResponseViewer() {
  const response = useResponseStore((s) => s.response);
  const error = useResponseStore((s) => s.error);
  const [activeTab, setActiveTab] = useState("Body");

  if (error) {
    return (
      <div className="border-t border-vscode-border mt-4 pt-4">
        <div className="text-red-400 text-sm px-3 py-2">{error}</div>
      </div>
    );
  }

  if (!response) return null;

  return (
    <div className="border-t border-vscode-border mt-4">
      <div className="flex items-center gap-4 px-3 py-2">
        <StatusBadge status={response.status} statusText={response.statusText} />
        <span className="text-xs opacity-50">{response.time}ms</span>
        <span className="text-xs opacity-50">{formatSize(response.size)}</span>
      </div>

      <TabBar
        tabs={["Body", "Headers"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "Body" && <ResponseBody body={response.body} />}

      {activeTab === "Headers" && (
        <div className="p-3">
          {Object.entries(response.headers).map(([key, value]) => (
            <div key={key} className="flex gap-2 text-xs mb-1">
              <span className="font-bold opacity-70">{key}:</span>
              <span className="opacity-50">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
