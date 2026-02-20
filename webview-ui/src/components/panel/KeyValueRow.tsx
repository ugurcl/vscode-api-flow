interface KeyValue {
  key: string;
  value: string;
  enabled: boolean;
}

interface KeyValueRowProps {
  item: KeyValue;
  index: number;
  onChange: (index: number, field: keyof KeyValue, value: string | boolean) => void;
  onRemove: (index: number) => void;
}

export function KeyValueRow({ item, index, onChange, onRemove }: KeyValueRowProps) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <input
        type="checkbox"
        checked={item.enabled}
        onChange={(e) => onChange(index, "enabled", e.target.checked)}
        className="w-3.5 h-3.5 shrink-0"
      />
      <input
        type="text"
        placeholder="Key"
        value={item.key}
        onChange={(e) => onChange(index, "key", e.target.value)}
        className="flex-1 px-2 py-1 rounded text-sm min-w-0"
      />
      <input
        type="text"
        placeholder="Value"
        value={item.value}
        onChange={(e) => onChange(index, "value", e.target.value)}
        className="flex-1 px-2 py-1 rounded text-sm min-w-0"
      />
      <button
        onClick={() => onRemove(index)}
        className="text-vscode-fg opacity-40 hover:opacity-100 px-1 shrink-0"
      >
        ×
      </button>
    </div>
  );
}
