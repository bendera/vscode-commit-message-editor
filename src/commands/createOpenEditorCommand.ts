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
          .then((commits) => {
            const message = createPostMessage('recentCommitMessages', commits);

            if (currentPanel) {
              currentPanel.webview.postMessage(message);
            }
          })
          .catch((er) => {
            vscode.window.showErrorMessage('Something went wrong', er);
          });
      };

      const confirmAmend = async (payload: string) => {
        const confirmAmend = vscode.workspace
          .getConfiguration('commit-message-editor')
          .get('confirmAmend');

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
          vscode.workspace
            .getConfiguration('commit-message-editor')
            .update('confirmAmend', false, vscode.ConfigurationTarget.Global);
        }
      };

      const performAmend = async (commitMessage: string) => {
        await vscode.commands.executeCommand('git.undoCommit');

        git.setSCMInputBoxMessage(commitMessage);
        populateCommitList();

        if (currentPanel) {
          currentPanel.webview.postMessage(createPostMessage('amendPerformed'));
        }
      };

      const createRepositoryInfoPostMessage = () => {
        const info = {
          numberOfRepositories: git.getNumberOfRepositories(),
          selectedRepositoryPath: git.getSelectedRepositoryPath(),
        };

        return createPostMessage('repositoryInfo', info);
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
          retainContextWhenHidden: true,
        }
      );
      const { webview } = currentPanel;
      const { extensionPath } = context;

      currentPanel.webview.html = EditorTab({
        extensionPath,
        platform: platform(),
        webview,
      });

      currentPanel.webview.onDidReceiveMessage(
        (data) => {
          const { command, payload } = data;

          switch (command) {
            case 'copyFromExtensionMessageBox':
              git.setSCMInputBoxMessage(payload);
              break;
            case 'closeTab':
              (<vscode.WebviewPanel>currentPanel).dispose();
              break;
            case 'requestConfig':
              const gitConfig = vscode.workspace.getConfiguration('git');
              const inputValidationLength = gitConfig.get(
                'inputValidationLength'
              );
              const inputValidationSubjectLength = gitConfig.get(
                'inputValidationSubjectLength'
              );

              (<vscode.WebviewPanel>currentPanel).webview.postMessage(
                createPostMessage('receiveConfig', {
                  'commit-message-editor': vscode.workspace.getConfiguration(
                    'commit-message-editor'
                  ),
                  git: {
                    inputValidationLength,
                    inputValidationSubjectLength,
                  }
                })
              );
              break;
            case 'requestRecentCommits':
              populateCommitList();
              break;
            case 'confirmAmend':
              confirmAmend(payload);
              break;
            case 'openConfigurationPage':
              vscode.commands.executeCommand(
                'commitMessageEditor.openSettingsPage'
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

      git.onRepositoryDidChange(() => {
        currentPanel?.webview.postMessage(createRepositoryInfoPostMessage());
        populateCommitList();
      });

      currentPanel.webview.postMessage(
        createPostMessage('copyFromSCMInputBox', git.getSCMInputBoxMessage())
      );
      currentPanel.webview.postMessage(createRepositoryInfoPostMessage());
    }
  );
};

export default createOpenEditorCommand;
