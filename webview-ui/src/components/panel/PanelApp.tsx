import { useState, useCallback } from "react";
import { useMessage } from "../../hooks/useMessage";
import { useRequestStore } from "../../store/request.store";
import { useResponseStore } from "../../store/response.store";
import { RequestBuilder } from "./RequestBuilder";
import { TabBar } from "./TabBar";
import { ParamsEditor } from "./ParamsEditor";
import { HeadersEditor } from "./HeadersEditor";
import { BodyEditor } from "./BodyEditor";
import { ResponseViewer } from "./ResponseViewer";

type ExtensionMessage =
  | { type: "responseReceived"; payload: { status: number; statusText: string; headers: Record<string, string>; body: string; time: number; size: number } }
  | { type: "requestError"; payload: { message: string } };

const REQUEST_TABS = ["Params", "Headers", "Body"];

export function PanelApp() {
  const [activeTab, setActiveTab] = useState("Params");
  const setLoading = useRequestStore((s) => s.setLoading);
  const setResponse = useResponseStore((s) => s.setResponse);
  const setError = useResponseStore((s) => s.setError);

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

  return (
    <div className="p-4">
      <RequestBuilder />

      <div className="mt-4">
        <TabBar tabs={REQUEST_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "Params" && <ParamsEditor />}
        {activeTab === "Headers" && <HeadersEditor />}
        {activeTab === "Body" && <BodyEditor />}
      </div>

      <ResponseViewer />
    </div>
  );
}
