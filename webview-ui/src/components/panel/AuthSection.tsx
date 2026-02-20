import { useEffect, useState, useCallback } from "react";
import { usePostMessage } from "../../hooks/usePostMessage";
import { useMessage } from "../../hooks/useMessage";

interface TokenInfo {
  label: string;
  headerName: string;
  prefix: string;
  jsonPath: string;
}

type ExtensionMessage =
  | { type: "activeToken"; payload: TokenInfo | null }
  | { type: "tokenInjected"; payload: { headerName: string; headerValue: string } };

export function AuthSection() {
  const [token, setToken] = useState<TokenInfo | null>(null);
  const postMessage = usePostMessage();

  useEffect(() => {
    postMessage({ type: "getActiveToken" });
  }, [postMessage]);

  const handleMessage = useCallback((message: ExtensionMessage) => {
    if (message.type === "activeToken") {
      setToken(message.payload);
    }
    if (message.type === "tokenInjected") {
      postMessage({ type: "getActiveToken" });
    }
  }, [postMessage]);

  useMessage(handleMessage);

  if (!token) {
    return (
      <div className="p-3">
        <div className="text-sm opacity-50">
          No active token. Send a login request and pick a token from the response.
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs opacity-50">Label:</span>
        <span className="text-sm">{token.label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs opacity-50">Header:</span>
        <span className="text-sm font-mono">{token.headerName}: {token.prefix} •••</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs opacity-50">Source:</span>
        <span className="text-sm font-mono">{token.jsonPath}</span>
      </div>
    </div>
  );
}
