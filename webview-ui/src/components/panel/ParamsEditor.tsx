import { useRequestStore } from "../../store/request.store";
import { KeyValueRow } from "./KeyValueRow";

export function ParamsEditor() {
  const queryParams = useRequestStore((s) => s.queryParams);
  const setQueryParams = useRequestStore((s) => s.setQueryParams);

  const handleChange = (index: number, field: string, value: string | boolean) => {
    const updated = [...queryParams];
    updated[index] = { ...updated[index], [field]: value };
    setQueryParams(updated);
  };

  const handleRemove = (index: number) => {
    if (queryParams.length <= 1) return;
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    setQueryParams([...queryParams, { key: "", value: "", enabled: true }]);
  };

  return (
    <div className="p-3">
      {queryParams.map((item, index) => (
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
        + Add Parameter
      </button>
    </div>
  );
}
