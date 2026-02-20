import { useCallback } from "react";
import { getVsCodeApi } from "../vscode";

export function usePostMessage<T>() {
  return useCallback((message: T) => {
    getVsCodeApi().postMessage(message);
  }, []);
}
