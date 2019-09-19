import { platform } from 'os';
import * as vscode from 'vscode';
import EditorTab from './views/EditorTab';
import GitService from './GitService';

export function activate(context: vscode.ExtensionContext) {
  const git = new GitService();
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  const openEditor: vscode.Disposable = vscode.commands.registerCommand(
    'commitMessageEditor.openEditor',
    () => {
      const columnToShowIn = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;

      if (currentPanel) {
        currentPanel.reveal(columnToShowIn);
        return;
      }

      currentPanel = vscode.window.createWebviewPanel(
        'editCommitMessage',
        'Edit commit message',
        (<vscode.ViewColumn>columnToShowIn),
        {
          enableScripts: true,
        }
      );
      const { webview } = currentPanel;
      const { extensionPath } = context;

      currentPanel.webview.html = EditorTab({
        extensionPath,
        webview,
        platform: platform(),
      });

      currentPanel.webview.onDidReceiveMessage(
        data => {
          if (data.command === 'copyFromExtensionMessageBox') {
            git.setSCMInputBoxMessage(data.payload);
          } else if (data.command === 'closeTab') {
            (<vscode.WebviewPanel>currentPanel).dispose();
          }
        },
        undefined,
        context.subscriptions
      );

      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        null,
        context.subscriptions
      );
    }
  );

  const copyFromSCMInputBox: vscode.Disposable = vscode.commands.registerCommand(
    'commitMessageEditor.copyFromSCMInputBox',
    () => {
      if (!currentPanel) {
        return;
      }

      currentPanel.webview.postMessage({
        command: 'copyFromSCMInputBox',
        payload: {
          inputBoxValue: git.getSCMInputBoxMessage(),
        },
      });
    }
  );

  context.subscriptions.push(openEditor);
  context.subscriptions.push(copyFromSCMInputBox);
}

export function deactivate() {}
