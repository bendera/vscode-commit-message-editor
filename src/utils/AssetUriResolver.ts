import * as path from 'path';
import * as vscode from 'vscode';

export default class AssetUriResolver {
  constructor(
    private _context: vscode.ExtensionContext,
    private _webview: vscode.Webview
  ) {}

  resolve(fp: string) {
    const { extensionPath } = this._context;
    const fragments = fp.split('/');
    const vscodeUri = vscode.Uri.file(path.join(extensionPath, ...fragments));

    return this._webview.asWebviewUri(vscodeUri);
  }
}
