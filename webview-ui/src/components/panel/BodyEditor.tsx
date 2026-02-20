import { useRequestStore } from "../../store/request.store";

export function BodyEditor() {
  const body = useRequestStore((s) => s.body);
  const setBody = useRequestStore((s) => s.setBody);

  return (
    <div className="p-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder='{"key": "value"}'
        className="w-full h-48 px-3 py-2 rounded font-mono text-sm resize-y"
        spellCheck={false}
      />
    </div>
  );
}
