import { platform } from 'os';
import * as vscode from 'vscode';
import AssetUriResolver from '../utils/AssetUriResolver';
import getNonce from '../utils/getNonce';

export default class SettingsView {
  private _uri: AssetUriResolver;
  private _platform: string;

  constructor(
    private _context: vscode.ExtensionContext,
    private _webview: vscode.Webview
  ) {
    this._uri = new AssetUriResolver(this._context, this._webview);
    this._platform = platform();
  }

  getHTML(viewId = 'default') {
    const { cspSource } = this._webview;
    const nonce = getNonce();
    const codiconUri = this._uri.resolve(
      'assets/codicons/dist/codicon.css'
    );
    const settingsAppUri = this._uri.resolve(
      'assets/frontend/dist/_bundled/cme-editor-page.js'
    );

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta
          http-equiv="Content-Security-Policy"
          content="
            default-src 'none';
            img-src ${cspSource};
            script-src ${cspSource} nonce-${nonce};
            style-src 'unsafe-inline' ${cspSource};
            style-src-elem 'unsafe-inline' ${cspSource};
            font-src ${cspSource}
          "
        />
        <title>Commit message editor</title>
        <link rel="stylesheet" href="${codiconUri}" nonce="${nonce}" id="vscode-codicon-stylesheet">
        <style>body { padding: 0 10px; }</style>
      </head>
      <body class="${this._platform}">
        <cme-settings-page></cme-esettings-page>
        <script src="${settingsAppUri}" nonce="${nonce}" type="module"></script>
      </body>
      </html>
    `
  }
}
