import * as vscode from 'vscode';
import { platform } from 'os';
import createPostMessage from '../utils/createPostMessage';
import EditorTab from '../webviews/EditorTab';
import GitService from '../utils/GitService';

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

      const confirmAmend = async (payload: string) => {
        const confirmAmend = vscode.workspace.getConfiguration('commit-message-editor').get('confirmAmend');

        if (!confirmAmend) {
          performAmend(payload);
          return;
        }

        const labelOk = 'Yes';
        const labelAlways = 'Always';

        const selected = await vscode.window.showWarningMessage(
          'Are you sure want to continue? Your last commit will be undone.',
          { modal: true },
          labelOk,
          labelAlways
        );

        if ([labelOk, labelAlways].includes(selected as string)) {
          performAmend(payload);
        }

        if (selected === labelAlways) {
          vscode.workspace.getConfiguration('commit-message-editor').update('confirmAmend', false, vscode.ConfigurationTarget.Global);
        }
      };

      const performAmend = async (commitMessage: string) => {
        await vscode.commands.executeCommand('git.undoCommit');

        git.setSCMInputBoxMessage(commitMessage);
        populateCommitList();
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
          const { command, payload } = data;

          switch (command) {
            case 'copyFromExtensionMessageBox':
              git.setSCMInputBoxMessage(payload);
              break;
            case 'closeTab':
              (<vscode.WebviewPanel>currentPanel).dispose();
              break;
            case 'requestConfig':
              (<vscode.WebviewPanel>currentPanel).webview.postMessage(
                createPostMessage('receiveConfig', {
                  staticTemplate: vscode.workspace.getConfiguration('commit-message-editor').get('staticTemplate'),
                  dynamicTemplate: vscode.workspace.getConfiguration('commit-message-editor').get('dynamicTemplate'),
                  tokens: vscode.workspace.getConfiguration('commit-message-editor').get('tokens'),
                  showRecentCommits: !!vscode.workspace.getConfiguration('commit-message-editor.view').get('showRecentCommits'),
                })
              );
              break;
            case 'requestRecentCommits':
              populateCommitList();
              break;
            case 'confirmAmend':
              confirmAmend(payload);
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
