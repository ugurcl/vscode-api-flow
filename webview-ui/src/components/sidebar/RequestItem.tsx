import { MethodBadge } from "../shared/MethodBadge";
import { usePostMessage } from "../../hooks/usePostMessage";

interface RequestItemProps {
  id: string;
  name: string;
  method: string;
  collectionId: string;
}

export function RequestItem({ id, name, method, collectionId }: RequestItemProps) {
  const postMessage = usePostMessage();

  const handleClick = () => {
    postMessage({ type: "openRequest", payload: { requestId: id, collectionId } });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    postMessage({ type: "deleteRequest", payload: { requestId: id, collectionId } });
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-vscode-list-hover rounded text-sm group"
    >
      <MethodBadge method={method} />
      <span className="truncate flex-1">{name}</span>
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-50 hover:!opacity-100 text-xs shrink-0"
      >
        ×
      </button>
    </div>
  );
}
