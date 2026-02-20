import { HttpMethod, AuthType } from "./enums";

export interface KeyValue {
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiRequest {
  id: string;
  method: HttpMethod;
  url: string;
  headers: KeyValue[];
  queryParams: KeyValue[];
  body: string;
  authType: AuthType;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
}

export interface SavedRequest extends ApiRequest {
  name: string;
  collectionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  requests: SavedRequest[];
}

export interface Environment {
  id: string;
  name: string;
  variables: KeyValue[];
  isActive: boolean;
}

export interface TokenConfig {
  label: string;
  value: string;
  headerName: string;
  prefix: string;
  sourceRequestId: string;
  jsonPath: string;
}
