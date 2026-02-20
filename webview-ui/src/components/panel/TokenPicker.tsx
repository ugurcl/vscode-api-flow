import { useMemo } from "react";
import { Modal } from "../shared/Modal";

interface TokenField {
  path: string;
  value: string;
}

interface TokenPickerProps {
  responseBody: string;
  onSelect: (path: string, value: string) => void;
  onClose: () => void;
}

function extractStringFields(obj: unknown, prefix: string = ""): TokenField[] {
  const fields: TokenField[] = [];

  if (typeof obj === "string") {
    fields.push({ path: prefix, value: obj });
    return fields;
  }

  if (typeof obj !== "object" || obj === null) return fields;

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string" && value.length > 10) {
      fields.push({ path, value });
    } else if (typeof value === "object" && value !== null) {
      fields.push(...extractStringFields(value, path));
    }
  }

  return fields;
}

export function TokenPicker({ responseBody, onSelect, onClose }: TokenPickerProps) {
  const fields = useMemo(() => {
    try {
      const parsed = JSON.parse(responseBody);
      return extractStringFields(parsed);
    } catch {
      return [];
    }
  }, [responseBody]);

  if (fields.length === 0) {
    return (
      <Modal title="Pick Token" onClose={onClose}>
        <div className="text-sm opacity-50 text-center py-4">
          No token-like fields found in response
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Pick Token" onClose={onClose}>
      <div className="space-y-1">
        {fields.map((field) => (
          <button
            key={field.path}
            onClick={() => onSelect(field.path, field.value)}
            className="w-full text-left px-3 py-2 rounded hover:bg-vscode-list-hover transition-colors"
          >
            <div className="text-xs font-mono text-vscode-button-bg">{field.path}</div>
            <div className="text-xs opacity-50 truncate mt-0.5">{field.value}</div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
