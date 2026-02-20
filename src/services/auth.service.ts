import { StorageService } from "./storage.service";
import { TokenConfig } from "../types/models";

const TOKEN_CONFIG_KEY = "apiFlow.tokenConfig";
const TOKEN_VALUE_KEY = "apiFlow.tokenValue";

export class AuthService {
  constructor(private storage: StorageService) {}

  async getTokenConfig(): Promise<TokenConfig | null> {
    return this.storage.get<TokenConfig>(TOKEN_CONFIG_KEY) ?? null;
  }

  async setToken(config: TokenConfig): Promise<void> {
    await this.storage.set(TOKEN_CONFIG_KEY, config);
    await this.storage.setSecret(TOKEN_VALUE_KEY, config.value);
  }

  async clearToken(): Promise<void> {
    await this.storage.remove(TOKEN_CONFIG_KEY);
    await this.storage.removeSecret(TOKEN_VALUE_KEY);
  }

  async getAuthHeaders(): Promise<Record<string, string>> {
    const config = await this.getTokenConfig();
    if (!config) return {};

    const tokenValue = await this.storage.getSecret(TOKEN_VALUE_KEY);
    if (!tokenValue) return {};

    const headerValue = config.prefix ? `${config.prefix} ${tokenValue}` : tokenValue;
    return { [config.headerName]: headerValue };
  }

  async hasToken(): Promise<boolean> {
    const config = await this.getTokenConfig();
    return config !== null;
  }

  async getTokenLabel(): Promise<string> {
    const config = await this.getTokenConfig();
    return config?.label ?? "";
  }
}
