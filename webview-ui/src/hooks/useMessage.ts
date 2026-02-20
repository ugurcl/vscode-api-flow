import { useEffect } from "react";

export function useMessage<T>(handler: (message: T) => void) {
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      handler(event.data as T);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [handler]);
}
