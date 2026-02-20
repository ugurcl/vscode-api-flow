import { useRequestStore } from "../../store/request.store";
import { usePostMessage } from "../../hooks/usePostMessage";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const;

interface RequestBuilderProps {
  onSave?: () => void;
}

export function RequestBuilder({ onSave }: RequestBuilderProps) {
  const { method, url, headers, queryParams, body, loading, setMethod, setUrl, setLoading } = useRequestStore();
  const postMessage = usePostMessage();

  const handleSend = () => {
    if (!url.trim() || loading) return;

    setLoading(true);
    postMessage({
      type: "sendRequest",
      payload: {
        id: crypto.randomUUID(),
        method,
        url: url.trim(),
        headers: headers.filter((h) => h.key),
        queryParams: queryParams.filter((p) => p.key),
        body,
        authType: "none",
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSend();
    }
  };

  return (
    <div className="flex gap-2">
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value as typeof method)}
        className="px-2 py-1.5 rounded text-sm font-mono font-bold shrink-0"
      >
        {METHODS.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="https://api.example.com/endpoint"
        className="flex-1 px-3 py-1.5 rounded text-sm min-w-0"
      />

      <button
        onClick={handleSend}
        disabled={loading || !url.trim()}
        className="px-4 py-1.5 bg-vscode-button-bg text-vscode-button-fg rounded text-sm font-medium hover:bg-vscode-button-hover disabled:opacity-40 shrink-0"
      >
        {loading ? "Sending..." : "Send"}
      </button>

      {onSave && (
        <button
          onClick={onSave}
          disabled={!url.trim()}
          className="px-3 py-1.5 border border-vscode-border rounded text-sm hover:bg-vscode-list-hover disabled:opacity-40 shrink-0"
        >
          Save
        </button>
      )}
    </div>
  );
}
