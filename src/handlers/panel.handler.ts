import * as vscode from "vscode";
import { PanelToExtension, ExtensionToPanel } from "../types/messages";
import { sendRequest } from "../services/http.service";
import { AuthService } from "../services/auth.service";

export function createPanelHandler(authService: AuthService) {
  return function handlePanelMessage(
    message: PanelToExtension,
    panel: vscode.WebviewPanel,
    onTokenChange?: () => void
  ) {
    const post = (msg: ExtensionToPanel) => panel.webview.postMessage(msg);

    switch (message.type) {
      case "sendRequest":
        authService.getAuthHeaders().then((authHeaders) => {
          return sendRequest(message.payload, authHeaders);
        }).then((response) => {
          post({ type: "responseReceived", payload: response });
        }).catch((error: Error) => {
          post({ type: "requestError", payload: { message: error.message } });
        });
        break;

      case "setToken":
        authService.setToken(message.payload).then(() => {
          post({
            type: "tokenInjected",
            payload: {
              headerName: message.payload.headerName,
              headerValue: `${message.payload.prefix} ${message.payload.value}`,
            },
          });
          onTokenChange?.();
        });
        break;

      case "getActiveToken":
        authService.getTokenConfig().then((config) => {
          post({ type: "activeToken", payload: config });
        });
        break;
    }
  };
}
