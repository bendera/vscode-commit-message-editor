import * as vscode from 'vscode';
import SettingsTab from '../webviews/SettingsTab';

class OpenSettingsPageCommand {
  private _currentPanel: vscode.WebviewPanel | undefined;
  private _context: vscode.ExtensionContext;

  constructor({ context }: { context: vscode.ExtensionContext }) {
    this._context = context;
  }

  run() {
    const columnToShowIn = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : vscode.ViewColumn.One;

    if (this._currentPanel) {
      this._currentPanel.reveal(columnToShowIn);
    } else {
      this._currentPanel = vscode.window.createWebviewPanel(
        'cmeSettingsPage',
        'Commit Message Editor Settings',
        columnToShowIn as vscode.ViewColumn,
        { enableScripts: true }
      );

      this._currentPanel.webview.html = SettingsTab({
        extensionPath: this._context.extensionPath,
        webview: this._currentPanel.webview,
      });

      this._currentPanel.onDidDispose(
        () => {
          this._currentPanel = undefined;
        },
        null,
        this._context.subscriptions
      );
    }
  }
}

export default OpenSettingsPageCommand;
