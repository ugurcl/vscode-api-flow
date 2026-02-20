export function interpolate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\$?\w+)\}\}/g, (match, key: string) => {
    if (key === "$timestamp") return Date.now().toString();
    if (key === "$randomId") return Math.random().toString(36).substring(2, 10);
    if (key === "$guid") return crypto.randomUUID();
    return variables[key] ?? match;
  });
}
