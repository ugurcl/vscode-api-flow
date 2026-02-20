import { useEffect, useCallback } from "react";
import { usePostMessage } from "../../hooks/usePostMessage";
import { useMessage } from "../../hooks/useMessage";
import { useEnvironmentStore } from "../../store/environment.store";

type ExtensionMessage =
  | { type: "environmentsLoaded"; payload: Array<{ id: string; name: string }> }
  | { type: "activeEnvironmentChanged"; payload: { environmentId: string } };

export function EnvironmentSelector() {
  const postMessage = usePostMessage();
  const { environments, activeId, setEnvironments, setActiveId } = useEnvironmentStore();

  useEffect(() => {
    postMessage({ type: "getEnvironments" });
  }, [postMessage]);

  const handleMessage = useCallback((message: ExtensionMessage) => {
    if (message.type === "environmentsLoaded") {
      setEnvironments(message.payload);
    }
    if (message.type === "activeEnvironmentChanged") {
      setActiveId(message.payload.environmentId);
    }
  }, [setEnvironments, setActiveId]);

  useMessage(handleMessage);

  if (environments.length === 0) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    postMessage({ type: "setActiveEnvironment", payload: { environmentId: e.target.value } });
  };

  return (
    <div className="px-2 mb-3">
      <select
        value={activeId ?? ""}
        onChange={handleChange}
        className="w-full px-2 py-1 rounded text-xs"
      >
        {environments.map((env) => (
          <option key={env.id} value={env.id}>{env.name}</option>
        ))}
      </select>
    </div>
  );
}
