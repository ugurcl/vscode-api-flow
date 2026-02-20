import { useState, useCallback } from "react";
import { useMessage } from "../../hooks/useMessage";
import { usePostMessage } from "../../hooks/usePostMessage";
import { useRequestStore } from "../../store/request.store";
import { useResponseStore } from "../../store/response.store";
import { useCollectionStore } from "../../store/collection.store";
import { RequestBuilder } from "./RequestBuilder";
import { TabBar } from "./TabBar";
import { ParamsEditor } from "./ParamsEditor";
import { HeadersEditor } from "./HeadersEditor";
import { BodyEditor } from "./BodyEditor";
import { AuthSection } from "./AuthSection";
import { ResponseViewer } from "./ResponseViewer";
import { TokenPicker } from "./TokenPicker";

type ExtensionMessage =
  | { type: "responseReceived"; payload: { status: number; statusText: string; headers: Record<string, string>; body: string; time: number; size: number } }
  | { type: "requestError"; payload: { message: string } }
  | { type: "tokenInjected"; payload: { headerName: string; headerValue: string } }
  | { type: "requestLoaded"; payload: { name: string; method: string; url: string; headers: Array<{ key: string; value: string; enabled: boolean }>; queryParams: Array<{ key: string; value: string; enabled: boolean }>; body: string; collectionId: string } }
  | { type: "activeToken"; payload: unknown };

const REQUEST_TABS = ["Params", "Headers", "Body", "Auth"];

export function PanelApp() {
  const [activeTab, setActiveTab] = useState("Params");
  const [showTokenPicker, setShowTokenPicker] = useState(false);
  const [requestId, setRequestId] = useState<string>("");
  const [collectionId, setCollectionId] = useState<string>("");
  const { method, url, headers, queryParams, body, setMethod, setUrl, setHeaders, setQueryParams, setBody, setLoading } = useRequestStore();
  const setResponse = useResponseStore((s) => s.setResponse);
  const setError = useResponseStore((s) => s.setError);
  const response = useResponseStore((s) => s.response);
  const collections = useCollectionStore((s) => s.collections);
  const postMessage = usePostMessage();

  const handleMessage = useCallback((message: ExtensionMessage) => {
    switch (message.type) {
      case "responseReceived":
        setLoading(false);
        setResponse(message.payload);
        break;
      case "requestError":
        setLoading(false);
        setError(message.payload.message);
        break;
      case "requestLoaded":
        setRequestId(message.payload.name);
        setCollectionId(message.payload.collectionId);
        setMethod(message.payload.method as "GET");
        setUrl(message.payload.url);
        setHeaders(message.payload.headers.length ? message.payload.headers : [{ key: "", value: "", enabled: true }]);
        setQueryParams(message.payload.queryParams.length ? message.payload.queryParams : [{ key: "", value: "", enabled: true }]);
        setBody(message.payload.body);
        break;
    }
  }, [setLoading, setResponse, setError, setMethod, setUrl, setHeaders, setQueryParams, setBody]);

  useMessage(handleMessage);

  const handleTokenSelect = (path: string, value: string) => {
    postMessage({
      type: "setToken",
      payload: {
        label: path.split(".").pop() ?? path,
        value,
        headerName: "Authorization",
        prefix: "Bearer",
        sourceRequestId: "",
        jsonPath: path,
      },
    });
    setShowTokenPicker(false);
  };

  const handleSave = () => {
    if (!url.trim()) return;
    const name = requestId || url.split("/").pop() || "Untitled";
    const targetCollection = collectionId || collections[0]?.id;
    if (!targetCollection) return;

    const now = new Date().toISOString();
    postMessage({
      type: "saveRequest",
      payload: {
        id: requestId || crypto.randomUUID(),
        name,
        method,
        url: url.trim(),
        headers: headers.filter((h) => h.key),
        queryParams: queryParams.filter((p) => p.key),
        body,
        authType: "none",
        collectionId: targetCollection,
        createdAt: now,
        updatedAt: now,
      },
    });
  };

  return (
    <div className="p-4">
      <RequestBuilder onSave={handleSave} />

      <div className="mt-4">
        <TabBar tabs={REQUEST_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "Params" && <ParamsEditor />}
        {activeTab === "Headers" && <HeadersEditor />}
        {activeTab === "Body" && <BodyEditor />}
        {activeTab === "Auth" && <AuthSection />}
      </div>

      <ResponseViewer onPickToken={() => setShowTokenPicker(true)} />

      {showTokenPicker && response && (
        <TokenPicker
          responseBody={response.body}
          onSelect={handleTokenSelect}
          onClose={() => setShowTokenPicker(false)}
        />
      )}
    </div>
  );
}
