import * as vscode from "vscode";
import { SidebarProvider } from "./providers/sidebar.provider";
import { PanelProvider } from "./providers/panel.provider";

export function activate(context: vscode.ExtensionContext) {
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
    vscode.commands.registerCommand("apiFlow.clearToken", () => {
      vscode.window.showInformationMessage("API Flow: Token cleared");
    })
  );
}

export function deactivate() {}
