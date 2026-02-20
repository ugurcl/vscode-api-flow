interface ResponseBodyProps {
  body: string;
}

export function ResponseBody({ body }: ResponseBodyProps) {
  let formatted = body;
  try {
    const parsed = JSON.parse(body);
    formatted = JSON.stringify(parsed, null, 2);
  } catch {
    // not json
  }

  return (
    <pre className="p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all overflow-auto max-h-96">
      {formatted}
    </pre>
  );
}
