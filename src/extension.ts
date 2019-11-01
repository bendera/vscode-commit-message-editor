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

      const populateCommitList = () => {
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
      };

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
          switch (data.command) {
            case 'copyFromExtensionMessageBox':
              git.setSCMInputBoxMessage(data.payload);
              break;
            case 'closeTab':
              (<vscode.WebviewPanel>currentPanel).dispose();
              break;
            case 'requestConfig':
              (<vscode.WebviewPanel>currentPanel).webview.postMessage(
                createPostMessage('receiveConfig', {
                  template: vscode.workspace.getConfiguration('commit-message-editor').get('template'),
                  tokens: vscode.workspace.getConfiguration('commit-message-editor').get('tokens'),
                })
              );
              break;
            default:
              break;
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
        populateCommitList();
      });

      populateCommitList();
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

  const loadTemplate: vscode.Disposable = vscode.commands.registerCommand(
    'commitMessageEditor.loadTemplate',
    () => {
      if (!currentPanel) {
        return;
      }

      currentPanel.webview.postMessage(
        createPostMessage('receiveConfig', {
          template: vscode.workspace.getConfiguration('commit-message-editor').get('template'),
        })
      );
    }
  );

  context.subscriptions.push(openEditor);
  context.subscriptions.push(copyFromSCMInputBox);
  context.subscriptions.push(loadTemplate);
}

export function deactivate() {}
