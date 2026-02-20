import { StorageService } from "./storage.service";
import { Environment, KeyValue } from "../types/models";

const ENVIRONMENTS_KEY = "apiFlow.environments";
const ACTIVE_ENV_KEY = "apiFlow.activeEnvironment";

export class EnvironmentService {
  constructor(private storage: StorageService) {}

  getAll(): Environment[] {
    return this.storage.get<Environment[]>(ENVIRONMENTS_KEY) ?? [];
  }

  async create(name: string): Promise<Environment> {
    const environments = this.getAll();
    const env: Environment = {
      id: crypto.randomUUID(),
      name,
      variables: [],
      isActive: environments.length === 0,
    };
    environments.push(env);
    await this.storage.set(ENVIRONMENTS_KEY, environments);
    if (env.isActive) {
      await this.storage.set(ACTIVE_ENV_KEY, env.id);
    }
    return env;
  }

  async remove(environmentId: string): Promise<void> {
    const environments = this.getAll().filter((e) => e.id !== environmentId);
    await this.storage.set(ENVIRONMENTS_KEY, environments);
    const activeId = this.storage.get<string>(ACTIVE_ENV_KEY);
    if (activeId === environmentId) {
      await this.storage.set(ACTIVE_ENV_KEY, environments[0]?.id ?? null);
    }
  }

  async setActive(environmentId: string): Promise<void> {
    await this.storage.set(ACTIVE_ENV_KEY, environmentId);
  }

  getActiveId(): string | undefined {
    return this.storage.get<string>(ACTIVE_ENV_KEY);
  }

  getActiveVariables(): Record<string, string> {
    const activeId = this.getActiveId();
    if (!activeId) return {};
    const env = this.getAll().find((e) => e.id === activeId);
    if (!env) return {};
    const vars: Record<string, string> = {};
    for (const v of env.variables) {
      if (v.enabled && v.key) {
        vars[v.key] = v.value;
      }
    }
    return vars;
  }

  async updateVariables(environmentId: string, variables: KeyValue[]): Promise<void> {
    const environments = this.getAll();
    const env = environments.find((e) => e.id === environmentId);
    if (env) {
      env.variables = variables;
      await this.storage.set(ENVIRONMENTS_KEY, environments);
    }
  }

  async rename(environmentId: string, name: string): Promise<void> {
    const environments = this.getAll();
    const env = environments.find((e) => e.id === environmentId);
    if (env) {
      env.name = name;
      await this.storage.set(ENVIRONMENTS_KEY, environments);
    }
  }
}
