import * as vscode from "vscode";

export class StorageService {
  constructor(private context: vscode.ExtensionContext) {}

  get<T>(key: string): T | undefined {
    return this.context.globalState.get<T>(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.context.globalState.update(key, value);
  }

  async remove(key: string): Promise<void> {
    await this.context.globalState.update(key, undefined);
  }

  async getSecret(key: string): Promise<string | undefined> {
    return this.context.secrets.get(key);
  }

  async setSecret(key: string, value: string): Promise<void> {
    await this.context.secrets.store(key, value);
  }

  async removeSecret(key: string): Promise<void> {
    await this.context.secrets.delete(key);
  }
}
