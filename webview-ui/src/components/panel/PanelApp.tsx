import { useState, useCallback } from "react";
import { useMessage } from "../../hooks/useMessage";
import { usePostMessage } from "../../hooks/usePostMessage";
import { useRequestStore } from "../../store/request.store";
import { useResponseStore } from "../../store/response.store";
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
  | { type: "activeToken"; payload: unknown };

const REQUEST_TABS = ["Params", "Headers", "Body", "Auth"];

export function PanelApp() {
  const [activeTab, setActiveTab] = useState("Params");
  const [showTokenPicker, setShowTokenPicker] = useState(false);
  const setLoading = useRequestStore((s) => s.setLoading);
  const setResponse = useResponseStore((s) => s.setResponse);
  const setError = useResponseStore((s) => s.setError);
  const response = useResponseStore((s) => s.response);
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
    }
  }, [setLoading, setResponse, setError]);

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

  return (
    <div className="p-4">
      <RequestBuilder />

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
