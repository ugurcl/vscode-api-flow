import { useMemo } from "react";

interface ResponseBodyProps {
  body: string;
}

function highlightJson(json: string): Array<{ text: string; className: string }> {
  const tokens: Array<{ text: string; className: string }> = [];
  const regex = /("(?:[^"\\]|\\.)*")\s*:|("(?:[^"\\]|\\.)*")|(\b(?:true|false|null)\b)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(json)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: json.slice(lastIndex, match.index), className: "" });
    }

    if (match[1]) {
      tokens.push({ text: match[1], className: "text-sky-400" });
      tokens.push({ text: json.slice(match.index + match[1].length, match.index + match[0].length), className: "" });
    } else if (match[2]) {
      tokens.push({ text: match[2], className: "text-amber-300" });
    } else if (match[3]) {
      tokens.push({ text: match[3], className: "text-purple-400" });
    } else if (match[4]) {
      tokens.push({ text: match[4], className: "text-green-400" });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < json.length) {
    tokens.push({ text: json.slice(lastIndex), className: "" });
  }

  return tokens;
}

export function ResponseBody({ body }: ResponseBodyProps) {
  const { formatted, isJson } = useMemo(() => {
    try {
      const parsed = JSON.parse(body);
      return { formatted: JSON.stringify(parsed, null, 2), isJson: true };
    } catch {
      return { formatted: body, isJson: false };
    }
  }, [body]);

  const tokens = useMemo(() => {
    if (!isJson) return null;
    return highlightJson(formatted);
  }, [formatted, isJson]);

  return (
    <pre className="p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all overflow-auto max-h-[500px]">
      {tokens ? (
        tokens.map((token, i) => (
          <span key={i} className={token.className}>{token.text}</span>
        ))
      ) : (
        formatted
      )}
    </pre>
  );
}
