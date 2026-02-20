import { ApiRequest, KeyValue } from "../types/models";
import { EnvironmentService } from "./environment.service";
import { interpolate } from "../utils/interpolation.util";

export class VariableService {
  constructor(private environmentService: EnvironmentService) {}

  getVariables(): Record<string, string> {
    return this.environmentService.getActiveVariables();
  }

  interpolateRequest(request: ApiRequest): ApiRequest {
    const vars = this.environmentService.getActiveVariables();

    return {
      ...request,
      url: interpolate(request.url, vars),
      headers: this.interpolateKeyValues(request.headers, vars),
      queryParams: this.interpolateKeyValues(request.queryParams, vars),
      body: interpolate(request.body, vars),
    };
  }

  private interpolateKeyValues(items: KeyValue[], vars: Record<string, string>): KeyValue[] {
    return items.map((item) => ({
      ...item,
      key: interpolate(item.key, vars),
      value: interpolate(item.value, vars),
    }));
  }
}
