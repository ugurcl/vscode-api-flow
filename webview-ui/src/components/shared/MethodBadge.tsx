const METHOD_COLORS: Record<string, string> = {
  GET: "text-green-400",
  POST: "text-yellow-400",
  PUT: "text-blue-400",
  PATCH: "text-orange-400",
  DELETE: "text-red-400",
  HEAD: "text-purple-400",
  OPTIONS: "text-gray-400",
};

interface MethodBadgeProps {
  method: string;
}

export function MethodBadge({ method }: MethodBadgeProps) {
  return (
    <span className={`font-mono text-xs font-bold ${METHOD_COLORS[method] ?? "text-gray-400"}`}>
      {method}
    </span>
  );
}
