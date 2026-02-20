import { create } from "zustand";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

interface KeyValue {
  key: string;
  value: string;
  enabled: boolean;
}

interface RequestState {
  method: HttpMethod;
  url: string;
  headers: KeyValue[];
  queryParams: KeyValue[];
  body: string;
  loading: boolean;
  setMethod: (method: HttpMethod) => void;
  setUrl: (url: string) => void;
  setHeaders: (headers: KeyValue[]) => void;
  setQueryParams: (params: KeyValue[]) => void;
  setBody: (body: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  method: "GET" as HttpMethod,
  url: "",
  headers: [{ key: "", value: "", enabled: true }],
  queryParams: [{ key: "", value: "", enabled: true }],
  body: "",
  loading: false,
};

export const useRequestStore = create<RequestState>((set) => ({
  ...initialState,
  setMethod: (method) => set({ method }),
  setUrl: (url) => set({ url }),
  setHeaders: (headers) => set({ headers }),
  setQueryParams: (params) => set({ queryParams: params }),
  setBody: (body) => set({ body }),
  setLoading: (loading) => set({ loading }),
  reset: () => set(initialState),
}));
