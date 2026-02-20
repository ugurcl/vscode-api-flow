import { usePostMessage } from "../../hooks/usePostMessage";
import { useCollectionStore } from "../../store/collection.store";

export function NewRequestButton() {
  const postMessage = usePostMessage();
  const collections = useCollectionStore((s) => s.collections);

  if (collections.length === 0) return null;

  const handleClick = () => {
    postMessage({
      type: "createRequest",
      payload: { collectionId: collections[0].id },
    });
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-xs py-1.5 opacity-50 hover:opacity-80 border border-dashed border-vscode-border rounded mt-2"
    >
      + New Request
    </button>
  );
}
