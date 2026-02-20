function getStatusColor(status: number): string {
  if (status < 300) return "text-green-400";
  if (status < 400) return "text-yellow-400";
  if (status < 500) return "text-orange-400";
  return "text-red-400";
}

interface StatusBadgeProps {
  status: number;
  statusText: string;
}

export function StatusBadge({ status, statusText }: StatusBadgeProps) {
  return (
    <span className={`font-mono text-sm font-bold ${getStatusColor(status)}`}>
      {status} {statusText}
    </span>
  );
}
