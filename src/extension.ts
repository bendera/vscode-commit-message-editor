import { platform } from 'os';
import * as vscode from 'vscode';
import EditorTab from './views/EditorTab';
import GitService from './GitService';

const createPostMessage = (command: string, payload: object): object => ({
  command,
  payload,
});

export function activate(context: vscode.ExtensionContext) {
  const git = new GitService();
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  const createPostMessageFromSCMInputBoxValue = () => ({
    command: 'copyFromSCMInputBox',
    payload: {
      inputBoxValue: git.getSCMInputBoxMessage(),
    },
  });

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
        <vscode.ViewColumn>columnToShowIn,
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

      currentPanel.onDidChangeViewState(() => {
        git
          .getRecentCommitMessages(10)
          .then(commits => {
            const message = createPostMessage('recentCommitMessages', { commits });

            if (currentPanel) {
              currentPanel.webview.postMessage(message);
            }
          })
          .catch(er => {
            vscode.window.showErrorMessage('Something went wrong', er);
          });
      });

      currentPanel.webview.postMessage(createPostMessageFromSCMInputBoxValue());
    }
  );

  const copyFromSCMInputBox: vscode.Disposable = vscode.commands.registerCommand(
    'commitMessageEditor.copyFromSCMInputBox',
    () => {
      if (!currentPanel) {
        return;
      }

      currentPanel.webview.postMessage(createPostMessageFromSCMInputBoxValue());
    }
  );

  context.subscriptions.push(openEditor);
  context.subscriptions.push(copyFromSCMInputBox);
}

export function deactivate() {}
