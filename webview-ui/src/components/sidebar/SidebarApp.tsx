import { useEffect, useCallback } from "react";
import { usePostMessage } from "../../hooks/usePostMessage";
import { useMessage } from "../../hooks/useMessage";
import { useCollectionStore } from "../../store/collection.store";
import { CollectionList } from "./CollectionList";
import { EnvironmentSelector } from "./EnvironmentSelector";

interface CollectionPayload {
  id: string;
  name: string;
  requests: Array<{ id: string; name: string; method: string; [key: string]: unknown }>;
}

type ExtensionMessage =
  | { type: "collectionsLoaded"; payload: CollectionPayload[] };

export function SidebarApp() {
  const postMessage = usePostMessage();
  const setCollections = useCollectionStore((s) => s.setCollections);

  useEffect(() => {
    postMessage({ type: "getCollections" });
  }, [postMessage]);

  const handleMessage = useCallback((message: ExtensionMessage) => {
    if (message.type === "collectionsLoaded") {
      setCollections(message.payload);
    }
  }, [setCollections]);

  useMessage(handleMessage);

  return (
    <div className="p-2">
      <EnvironmentSelector />
      <CollectionList />
    </div>
  );
}
