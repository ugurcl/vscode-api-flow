import * as vscode from "vscode";
import { SidebarProvider } from "./providers/sidebar.provider";
import { PanelProvider } from "./providers/panel.provider";
import { StatusbarProvider } from "./providers/statusbar.provider";
import { StorageService } from "./services/storage.service";
import { AuthService } from "./services/auth.service";
import { CollectionService } from "./services/collection.service";
import { createPanelHandler } from "./handlers/panel.handler";
import { createSidebarHandler } from "./handlers/sidebar.handler";

export function activate(context: vscode.ExtensionContext) {
  const storage = new StorageService(context);
  const authService = new AuthService(storage);
  const collectionService = new CollectionService(storage);
  const statusbar = new StatusbarProvider(authService);

  const sidebarProvider = new SidebarProvider(context.extensionUri);

  const refreshSidebar = () => {
    if (sidebarProvider.view) {
      sidebarProvider.view.webview.postMessage({
        type: "collectionsLoaded",
        payload: collectionService.getAll(),
      });
    }
  };

  const panelHandler = createPanelHandler(authService, collectionService);
  PanelProvider.init(panelHandler, () => statusbar.update(), refreshSidebar);
  statusbar.update();

  const sidebarHandler = createSidebarHandler(collectionService);
  sidebarProvider.setMessageHandler(sidebarHandler, (requestId, collectionId) => {
    const request = collectionService.getRequest(collectionId, requestId);
    if (request) {
      const panel = PanelProvider.createOrShow(context.extensionUri, request.name);
      panel.webview.postMessage({ type: "requestLoaded", payload: request });
    }
  });

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("apiFlow.sidebar", sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("apiFlow.newRequest", () => {
      PanelProvider.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("apiFlow.newCollection", async () => {
      const name = await vscode.window.showInputBox({
        prompt: "Collection name",
        placeHolder: "My API",
      });
      if (name) {
        await collectionService.create(name);
        refreshSidebar();
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("apiFlow.manageEnvironments", () => {
      vscode.window.showInformationMessage("API Flow: Manage Environments");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("apiFlow.clearToken", async () => {
      await authService.clearToken();
      await statusbar.update();
      vscode.window.showInformationMessage("API Flow: Token cleared");
    })
  );

  context.subscriptions.push({ dispose: () => statusbar.dispose() });
}

export function deactivate() {}
