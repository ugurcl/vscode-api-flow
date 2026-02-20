import axios, { AxiosError } from "axios";
import { ApiRequest, ApiResponse, KeyValue } from "../types/models";

function buildQueryString(params: KeyValue[]): string {
  const active = params.filter((p) => p.enabled && p.key);
  if (active.length === 0) return "";
  const qs = active.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join("&");
  return `?${qs}`;
}

function buildHeaders(headers: KeyValue[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const h of headers) {
    if (h.enabled && h.key) {
      result[h.key] = h.value;
    }
  }
  return result;
}

export async function sendRequest(
  request: ApiRequest,
  extraHeaders?: Record<string, string>
): Promise<ApiResponse> {
  const url = request.url + buildQueryString(request.queryParams);
  const headers = { ...buildHeaders(request.headers), ...extraHeaders };

  const hasBody = ["POST", "PUT", "PATCH"].includes(request.method);
  let data: unknown = undefined;

  if (hasBody && request.body) {
    try {
      data = JSON.parse(request.body);
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
    } catch {
      data = request.body;
    }
  }

  const start = Date.now();

  try {
    const response = await axios({
      method: request.method.toLowerCase(),
      url,
      headers,
      data,
      validateStatus: () => true,
      timeout: 30000,
    });

    const time = Date.now() - start;
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data, null, 2);
    const size = Buffer.byteLength(body, "utf-8");

    const responseHeaders: Record<string, string> = {};
    for (const [key, val] of Object.entries(response.headers)) {
      if (typeof val === "string") {
        responseHeaders[key] = val;
      }
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body,
      time,
      size,
    };
  } catch (error) {
    const time = Date.now() - start;
    if (error instanceof AxiosError) {
      throw new Error(error.message);
    }
    throw new Error(`Request failed after ${time}ms`);
  }
}
