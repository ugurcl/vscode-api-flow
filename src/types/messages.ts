import { ApiRequest, ApiResponse, Collection, Environment, SavedRequest, TokenConfig } from "./models";

export type PanelToExtension =
  | { type: "sendRequest"; payload: ApiRequest }
  | { type: "saveRequest"; payload: SavedRequest }
  | { type: "setToken"; payload: TokenConfig }
  | { type: "getActiveToken" }
  | { type: "getEnvironmentVariables" };

export type SidebarToExtension =
  | { type: "openRequest"; payload: { requestId: string; collectionId: string } }
  | { type: "createRequest"; payload: { collectionId: string } }
  | { type: "deleteRequest"; payload: { requestId: string; collectionId: string } }
  | { type: "createCollection"; payload: { name: string } }
  | { type: "deleteCollection"; payload: { collectionId: string } }
  | { type: "setActiveEnvironment"; payload: { environmentId: string } }
  | { type: "getCollections" }
  | { type: "getEnvironments" };

export type ExtensionToPanel =
  | { type: "responseReceived"; payload: ApiResponse }
  | { type: "requestLoaded"; payload: SavedRequest }
  | { type: "tokenInjected"; payload: { headerName: string; headerValue: string } }
  | { type: "variablesLoaded"; payload: Record<string, string> }
  | { type: "requestError"; payload: { message: string } }
  | { type: "activeToken"; payload: TokenConfig | null };

export type ExtensionToSidebar =
  | { type: "collectionsLoaded"; payload: Collection[] }
  | { type: "environmentsLoaded"; payload: Environment[] }
  | { type: "activeEnvironmentChanged"; payload: { environmentId: string } }
  | { type: "tokenStatusChanged"; payload: { hasToken: boolean; label: string } };
