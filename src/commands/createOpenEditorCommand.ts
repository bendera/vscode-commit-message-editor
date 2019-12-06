import * as vscode from 'vscode';
import { platform } from 'os';
import createPostMessage from '../utils/createPostMessage';
import EditorTab from '../webviews/EditorTab';
import GitService from '../utils/GitService';
import getExtensionConfig from '../utils/getExtensionConfig';

const createOpenEditorCommand = ({
  context,
  currentPanel,
  git,
}: {
  context: vscode.ExtensionContext;
  currentPanel: vscode.WebviewPanel | undefined;
  git: GitService;
}) => {
  return vscode.commands.registerCommand(
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
      const defaultView = String(
        vscode.workspace.getConfiguration('commit-message-editor.view').get('defaultView')
      );
      const showRecentCommits = Boolean(
        vscode.workspace.getConfiguration('commit-message-editor.view').get('showRecentCommits')
      );

      currentPanel.webview.html = EditorTab({
        extensionPath,
        webview,
        platform: platform(),
        defaultView,
        showRecentCommits,
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
                createPostMessage('receiveConfig', getExtensionConfig())
              );
              break;
            case 'requestRecentCommits':
              populateCommitList();
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

      currentPanel.webview.postMessage(createPostMessage('copyFromSCMInputBox', {
        inputBoxValue: git.getSCMInputBoxMessage(),
      }));
    }
  );
};

export default createOpenEditorCommand;
