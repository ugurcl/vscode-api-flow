import * as vscode from "vscode";

export function getNonce(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let i = 0; i < 32; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

export function getWebviewHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  viewType: "sidebar" | "panel"
): string {
  const distUri = vscode.Uri.joinPath(extensionUri, "dist", "webview");
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(distUri, "index.js"));
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(distUri, "index.css"));
  const nonce = getNonce();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; connect-src https: http:;">
  <link rel="stylesheet" href="${styleUri}">
  <title>API Flow</title>
</head>
<body>
  <div id="root" data-view="${viewType}"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}
