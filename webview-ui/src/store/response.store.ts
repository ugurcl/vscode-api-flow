import { create } from "zustand";

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
}

interface ResponseState {
  response: ApiResponse | null;
  error: string | null;
  setResponse: (response: ApiResponse) => void;
  setError: (error: string) => void;
  clear: () => void;
}

export const useResponseStore = create<ResponseState>((set) => ({
  response: null,
  error: null,
  setResponse: (response) => set({ response, error: null }),
  setError: (error) => set({ error, response: null }),
  clear: () => set({ response: null, error: null }),
}));
