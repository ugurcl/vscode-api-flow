import * as vscode from "vscode";
import { getWebviewHtml } from "../utils/webview.util";
import { SidebarToExtension } from "../types/messages";

type SidebarMessageHandler = (
  message: SidebarToExtension,
  view: vscode.WebviewView,
  onOpenRequest?: (requestId: string, collectionId: string) => void
) => void;

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _messageHandler?: SidebarMessageHandler;
  private _onOpenRequest?: (requestId: string, collectionId: string) => void;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  setMessageHandler(handler: SidebarMessageHandler, onOpenRequest?: (requestId: string, collectionId: string) => void) {
    this._messageHandler = handler;
    this._onOpenRequest = onOpenRequest;
  }

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

    if (this._messageHandler) {
      const handler = this._messageHandler;
      const onOpenRequest = this._onOpenRequest;
      webviewView.webview.onDidReceiveMessage((message: SidebarToExtension) => {
        handler(message, webviewView, onOpenRequest);
      });
    }
  }

  refreshCollections(): void {
    this._view?.webview.postMessage({
      type: "collectionsLoaded",
      payload: [],
    });
  }

  get view(): vscode.WebviewView | undefined {
    return this._view;
  }
}
