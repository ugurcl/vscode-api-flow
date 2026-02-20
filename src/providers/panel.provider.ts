import * as vscode from "vscode";
import { getWebviewHtml } from "../utils/webview.util";
import { PanelToExtension } from "../types/messages";

type PanelMessageHandler = (
  message: PanelToExtension,
  panel: vscode.WebviewPanel,
  onTokenChange?: () => void,
  onCollectionChange?: () => void
) => void;

export class PanelProvider {
  private static panels: Map<string, vscode.WebviewPanel> = new Map();
  private static messageHandler: PanelMessageHandler;
  private static onTokenChange?: () => void;
  private static onCollectionChange?: () => void;

  static init(handler: PanelMessageHandler, onTokenChange?: () => void, onCollectionChange?: () => void) {
    PanelProvider.messageHandler = handler;
    PanelProvider.onTokenChange = onTokenChange;
    PanelProvider.onCollectionChange = onCollectionChange;
  }

  static createOrShow(extensionUri: vscode.Uri, title: string = "New Request"): vscode.WebviewPanel {
    const column = vscode.ViewColumn.One;
    const panelId = `apiFlow-${Date.now()}`;

    const panel = vscode.window.createWebviewPanel(
      "apiFlow.requestPanel",
      title,
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, "dist")],
      }
    );

    panel.webview.html = getWebviewHtml(panel.webview, extensionUri, "panel");

    panel.webview.onDidReceiveMessage((message: PanelToExtension) => {
      PanelProvider.messageHandler(message, panel, PanelProvider.onTokenChange, PanelProvider.onCollectionChange);
    });

    panel.onDidDispose(() => {
      PanelProvider.panels.delete(panelId);
    });

    PanelProvider.panels.set(panelId, panel);
    return panel;
  }
}
