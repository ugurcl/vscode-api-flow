import { useState } from "react";
import { usePostMessage } from "../../hooks/usePostMessage";
import { RequestItem } from "./RequestItem";

interface Request {
  id: string;
  name: string;
  method: string;
}

interface CollectionItemProps {
  id: string;
  name: string;
  requests: Request[];
}

export function CollectionItem({ id, name, requests }: CollectionItemProps) {
  const [expanded, setExpanded] = useState(true);
  const postMessage = usePostMessage();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    postMessage({ type: "deleteCollection", payload: { collectionId: id } });
  };

  return (
    <div className="mb-1">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 px-2 py-1 cursor-pointer hover:bg-vscode-list-hover rounded text-sm group"
      >
        <span className="text-xs opacity-50">{expanded ? "▼" : "▶"}</span>
        <span className="font-medium flex-1 truncate">{name}</span>
        <span className="text-xs opacity-30">{requests.length}</span>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-50 hover:!opacity-100 text-xs shrink-0"
        >
          ×
        </button>
      </div>
      {expanded && (
        <div className="ml-3">
          {requests.map((req) => (
            <RequestItem
              key={req.id}
              id={req.id}
              name={req.name}
              method={req.method}
              collectionId={id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
