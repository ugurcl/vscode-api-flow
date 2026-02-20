import * as vscode from "vscode";
import { SidebarProvider } from "./providers/sidebar.provider";
import { PanelProvider } from "./providers/panel.provider";
import { StatusbarProvider } from "./providers/statusbar.provider";
import { StorageService } from "./services/storage.service";
import { AuthService } from "./services/auth.service";
import { createPanelHandler } from "./handlers/panel.handler";

export function activate(context: vscode.ExtensionContext) {
  const storage = new StorageService(context);
  const authService = new AuthService(storage);
  const statusbar = new StatusbarProvider(authService);
  const panelHandler = createPanelHandler(authService);

  PanelProvider.init(panelHandler, () => statusbar.update());
  statusbar.update();

  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("apiFlow.sidebar", sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("apiFlow.newRequest", () => {
      PanelProvider.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("apiFlow.newCollection", () => {
      vscode.window.showInformationMessage("API Flow: New Collection");
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
