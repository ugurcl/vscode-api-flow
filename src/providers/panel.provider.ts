import * as vscode from "vscode";
import { getWebviewHtml } from "../utils/webview.util";

export class PanelProvider {
  private static panels: Map<string, vscode.WebviewPanel> = new Map();

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

    panel.onDidDispose(() => {
      PanelProvider.panels.delete(panelId);
    });

    PanelProvider.panels.set(panelId, panel);
    return panel;
  }
}
