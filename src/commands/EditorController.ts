import * as vscode from 'vscode';
import { ViewType } from '../constants';
import GitService from '../utils/GitService';
import EditorView from '../webviews/EditorView';
import UiApi from '../utils/UiApi';

type ViewColumnKey =
  | 'Active'
  | 'Beside'
  | 'One'
  | 'Two'
  | 'Three'
  | 'Four'
  | 'Five'
  | 'Six'
  | 'Seven'
  | 'Eight'
  | 'Nine';

type ViewColumnMap = Record<ViewColumnKey, number>;

const editorGroupMap: ViewColumnMap = {
  Active: vscode.ViewColumn.Active,
  Beside: vscode.ViewColumn.Beside,
  One: vscode.ViewColumn.One,
  Two: vscode.ViewColumn.Two,
  Three: vscode.ViewColumn.Three,
  Four: vscode.ViewColumn.Four,
  Five: vscode.ViewColumn.Five,
  Six: vscode.ViewColumn.Six,
  Seven: vscode.ViewColumn.Seven,
  Eight: vscode.ViewColumn.Eight,
  Nine: vscode.ViewColumn.Nine,
};

export default class EditorController {
  private _primaryEditorPanel: vscode.WebviewPanel | undefined;
  private _ui: UiApi | undefined;

  constructor(
    private _context: vscode.ExtensionContext,
    private _git: GitService
  ) {}

  openInTheMainView() {
    const config = vscode.workspace.getConfiguration('commit-message-editor');

    if (this._primaryEditorPanel) {
      this._primaryEditorPanel.reveal();
    } else {
      this._primaryEditorPanel = vscode.window.createWebviewPanel(
        ViewType.PrimaryEditor,
        'Commit Message Editor',
        editorGroupMap[config.view.columnToShowIn as ViewColumnKey],
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
    this._ui.sendRepositoryInfo(this._getRepositoryInfo());

    this._initReceivedMessageListener();
    this._git.onRepositoryDidChange(this._handleRepositoryDidChange, this);
  }

  get primaryEditorPanel(): vscode.WebviewPanel | undefined {
    return this._primaryEditorPanel;
  }

  private _handleRepositoryDidChange() {
    console.log('repository did change');
    this._ui?.sendRepositoryInfo(this._getRepositoryInfo());
    this._populateCommitList();
  }

  private _getRepositoryInfo() {
    return {
      numberOfRepositories: this._git.getNumberOfRepositories(),
      selectedRepositoryPath: this._git.getSelectedRepositoryPath(),
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
      case 'copyFromExtensionMessageBox':
        this._git.setSCMInputBoxMessage(payload);
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
