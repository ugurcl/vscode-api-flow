import * as vscode from "vscode";
import { AuthService } from "../services/auth.service";

export class StatusbarProvider {
  private item: vscode.StatusBarItem;

  constructor(private authService: AuthService) {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.item.command = "apiFlow.clearToken";
  }

  async update(): Promise<void> {
    const hasToken = await this.authService.hasToken();
    if (hasToken) {
      const label = await this.authService.getTokenLabel();
      this.item.text = `$(key) ${label || "Token Active"}`;
      this.item.tooltip = "Click to clear active token";
      this.item.show();
    } else {
      this.item.hide();
    }
  }

  dispose(): void {
    this.item.dispose();
  }
}
