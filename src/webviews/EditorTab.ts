import * as path from 'path';
import * as vscode from 'vscode';
import getNonce from '../utils/getNonce';

interface EditorTabProps {
  extensionPath: string;
  platform: string;
  webview: vscode.Webview;
}

const EditorTab = ({ extensionPath, platform, webview }: EditorTabProps) => {
  const assetUri = (fp: string) => {
    const fragments = fp.split('/');
    const vscodeUri = vscode.Uri.file(
      path.join(extensionPath, ...fragments)
    );

    return webview.asWebviewUri(vscodeUri);
  };

  const { cspSource } = webview;
  const nonce = getNonce();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'none'; img-src ${cspSource}; script-src ${cspSource} nonce-${nonce}; style-src 'unsafe-inline' ${cspSource}; style-src-elem 'unsafe-inline' ${cspSource}; font-src ${cspSource}"
      />
      <title>Commit message editor</title>
      <link rel="stylesheet" href="${assetUri('node_modules/vscode-codicons/dist/codicon.css')}" nonce="${nonce}" id="vscode-codicon-stylesheet">
      <style>body { padding: 0 10px; }</style>
    </head>
    <body class="${platform}">
      <cme-editor-page></cme-editor-page>
      <script src="${assetUri('frontend/dist/_bundled/cme-editor-page.js')}" nonce="${nonce}" type="module"></script>
    </body>
    </html>
  `;

  return html;
};

export default EditorTab;
