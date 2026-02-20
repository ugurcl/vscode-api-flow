import { useRequestStore } from "../../store/request.store";
import { KeyValueRow } from "./KeyValueRow";

export function HeadersEditor() {
  const headers = useRequestStore((s) => s.headers);
  const setHeaders = useRequestStore((s) => s.setHeaders);

  const handleChange = (index: number, field: string, value: string | boolean) => {
    const updated = [...headers];
    updated[index] = { ...updated[index], [field]: value };
    setHeaders(updated);
  };

  const handleRemove = (index: number) => {
    if (headers.length <= 1) return;
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    setHeaders([...headers, { key: "", value: "", enabled: true }]);
  };

  return (
    <div className="p-3">
      {headers.map((item, index) => (
        <KeyValueRow
          key={index}
          item={item}
          index={index}
          onChange={handleChange}
          onRemove={handleRemove}
        />
      ))}
      <button
        onClick={handleAdd}
        className="text-xs opacity-50 hover:opacity-80 mt-1"
      >
        + Add Header
      </button>
    </div>
  );
}
