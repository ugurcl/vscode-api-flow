import * as vscode from "vscode";
import { AuthService } from "../services/auth.service";
import { EnvironmentService } from "../services/environment.service";

export class StatusbarProvider {
  private tokenItem: vscode.StatusBarItem;
  private envItem: vscode.StatusBarItem;

  constructor(private authService: AuthService) {
    this.tokenItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.tokenItem.command = "apiFlow.clearToken";

    this.envItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    this.envItem.command = "apiFlow.manageEnvironments";
  }

  async update(): Promise<void> {
    const hasToken = await this.authService.hasToken();
    if (hasToken) {
      const label = await this.authService.getTokenLabel();
      this.tokenItem.text = `$(key) ${label || "Token Active"}`;
      this.tokenItem.tooltip = "Click to clear active token";
      this.tokenItem.show();
    } else {
      this.tokenItem.hide();
    }
  }

  updateEnvironment(envService: EnvironmentService): void {
    const activeId = envService.getActiveId();
    if (activeId) {
      const envs = envService.getAll();
      const active = envs.find((e) => e.id === activeId);
      if (active) {
        this.envItem.text = `$(server-environment) ${active.name}`;
        this.envItem.tooltip = "Click to switch environment";
        this.envItem.show();
        return;
      }
    }
    this.envItem.hide();
  }

  dispose(): void {
    this.tokenItem.dispose();
    this.envItem.dispose();
  }
}
