import * as vscode from "vscode";
import { PanelToExtension, ExtensionToPanel } from "../types/messages";
import { sendRequest } from "../services/http.service";

export function handlePanelMessage(
  message: PanelToExtension,
  panel: vscode.WebviewPanel
) {
  const post = (msg: ExtensionToPanel) => panel.webview.postMessage(msg);

  switch (message.type) {
    case "sendRequest":
      sendRequest(message.payload)
        .then((response) => {
          post({ type: "responseReceived", payload: response });
        })
        .catch((error: Error) => {
          post({ type: "requestError", payload: { message: error.message } });
        });
      break;

    case "getActiveToken":
      post({ type: "activeToken", payload: null });
      break;
  }
}
