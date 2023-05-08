import * as vscode from 'vscode';
import { Repository } from '../@types/git';
import { editorGroupNameMap, ViewColumnKey, ViewType } from '../definitions';
import GitService, { RepositoryInfo } from '../utils/GitService';
import EditorView from '../webviews/EditorView';
import UiApi from '../utils/UiApi';
import Logger from '../utils/Logger';

export default class EditorController {
  private _primaryEditorPanel: vscode.WebviewPanel | undefined;
  private _ui: UiApi | undefined;
  private _selectedRepository: string | undefined;

  constructor(
    private _context: vscode.ExtensionContext,
    private _git: GitService,
    private _logger: Logger
  ) {}

  async openInTheMainView(repo: Repository) {
    this._logger.log('Opened in the main view');
    const config = vscode.workspace.getConfiguration('commit-message-editor');

    if (this._primaryEditorPanel) {
      this._primaryEditorPanel.reveal();
    } else {
      this._primaryEditorPanel = vscode.window.createWebviewPanel(
        ViewType.PrimaryEditor,
        'Commit Message Editor',
        editorGroupNameMap[config.view.columnToShowIn as ViewColumnKey],
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );
      this._primaryEditorPanel.onDidDispose(
        () => {
          this._primaryEditorPanel = undefined;
        },
        null,
        this._context.subscriptions
      );

      const view = new EditorView(
        this._context,
        this._primaryEditorPanel.webview
      );
      this._primaryEditorPanel.webview.html = view.getHTML(
        ViewType.PrimaryEditor
      );
      this._context.subscriptions.push(this._primaryEditorPanel);
    }

    this._ui = new UiApi(this._primaryEditorPanel.webview);
    this._ui.sendSCMInputBoxValue(this._git.getSCMInputBoxMessage());
    this._ui.sendConfig(config);

    if (repo && repo.rootUri) {
      const repoPath = repo.rootUri.path;
      const commits = await this._git.getRecentCommitMessagesByPath(repoPath);
      const repositoryInfo = {
        numberOfRepositories: this._git.getNumberOfRepositories(),
        selectedRepositoryPath: repoPath,
        availableRepositories: this._git.getAvailableRepositoryPaths(),
      };

      this._ui.sendRepositoryInfo(repositoryInfo);
      this._logger.logObject(
        repositoryInfo,
        'Suggested repository:'
      );
      this._ui.sendRecentCommits(commits);
    } else {
      const repositoryInfo = this._getRepositoryInfo();
      this._ui.sendRepositoryInfo(repositoryInfo);
      this._logger.logObject(repositoryInfo, 'Default repository:');
    }

    this._initReceivedMessageListener();
    this._git.onRepositoryDidChange(this._handleRepositoryDidChangeBound);
  }

  get primaryEditorPanel(): vscode.WebviewPanel | undefined {
    return this._primaryEditorPanel;
  }

  private async _handleRepositoryDidChange(repositoryInfo: RepositoryInfo) {
    this._logger.logObject(repositoryInfo, 'Repository did change:');
    this._ui?.sendRepositoryInfo(repositoryInfo);

    const { selectedRepositoryPath } = repositoryInfo;
    const commits = await this._git.getRecentCommitMessagesByPath(
      selectedRepositoryPath
    );

    this._ui?.sendRecentCommits(commits);
  }

  private _handleRepositoryDidChangeBound =
    this._handleRepositoryDidChange.bind(this);

  private _getRepositoryInfo() {
    return {
      numberOfRepositories: this._git.getNumberOfRepositories(),
      selectedRepositoryPath: this._git.getSelectedRepositoryPath(),
      availableRepositories: this._git.getAvailableRepositoryPaths(),
    };
  }

  private _initReceivedMessageListener() {
    this._primaryEditorPanel?.webview.onDidReceiveMessage(
      this._handleReceivedMessages,
      this
    );
  }

  private _handleReceivedMessages(data: any) {
    const { command, payload } = data;

    switch (command) {
      // TODO: rename
      case 'copyFromExtensionMessageBox':
        const { commitMessage, selectedRepositoryPath } = payload;
        this._git.setSCMInputBoxMessage(commitMessage, selectedRepositoryPath);
        break;
      case 'closeTab':
        this._primaryEditorPanel?.dispose();
        break;
      case 'requestConfig':
        const cfg = vscode.workspace.getConfiguration('commit-message-editor');
        this._ui?.sendConfig(cfg);
        break;
      case 'requestRecentCommits':
        this._populateCommitList();
        break;
      case 'confirmAmend':
        this._confirmAmend(payload);
        break;
      case 'openConfigurationPage':
        vscode.commands.executeCommand('commitMessageEditor.openSettingsPage');
        break;
      default:
        break;
    }
  }

  private _populateCommitList() {
    this._git
      .getRecentCommitMessages(10)
      .then((commits) => {
        this._ui?.sendRecentCommits(commits);
      })
      .catch((er) => {
        vscode.window.showErrorMessage('Something went wrong', er);
      });
  }

  private async _confirmAmend(payload: string) {
    const confirmAmend = vscode.workspace
      .getConfiguration('commit-message-editor')
      .get('confirmAmend');

    if (!confirmAmend) {
      this._performAmend(payload);
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
      this._performAmend(payload);
    }

    if (selected === labelAlways) {
      vscode.workspace
        .getConfiguration('commit-message-editor')
        .update('confirmAmend', false, vscode.ConfigurationTarget.Global);
    }
  }

  private async _performAmend(commitMessage: string) {
    await vscode.commands.executeCommand('git.undoCommit');

    this._git.setSCMInputBoxMessage(commitMessage);
    this._populateCommitList();

    if (this._primaryEditorPanel) {
      this._ui?.sendAmendPerformed();
    }
  }
}
