import * as vscode from "vscode";
import { getWebviewHtml } from "../utils/webview.util";

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, "dist")],
    };

    webviewView.webview.html = getWebviewHtml(
      webviewView.webview,
      this._extensionUri,
      "sidebar"
    );
  }

  get view(): vscode.WebviewView | undefined {
    return this._view;
  }
}
