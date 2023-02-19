import * as vscode from 'vscode';
import { Commit } from '../@types/git';
import createPostMessage from './createPostMessage';

export default class UiApi {
  constructor(private _webView: vscode.Webview) {}

  sendSCMInputBoxValue(message: string) {
    this._webView.postMessage(
      createPostMessage('copyFromSCMInputBox', message)
    );
  }

  sendRepositoryInfo(info: {
    numberOfRepositories: number;
    selectedRepositoryPath: string | undefined;
  }) {
    this._webView.postMessage(createPostMessage('repositoryInfo', info));
  }

  sendConfig(config: vscode.WorkspaceConfiguration) {
    this._webView.postMessage(createPostMessage('receiveConfig', config));
  }

  sendRecentCommits(commits: Commit[]) {
    this._webView.postMessage(
      createPostMessage('recentCommitMessages', commits)
    );
  }

  sendAmendPerformed() {
    this._webView.postMessage(createPostMessage('amendPerformed'));
  }

  sendStatusMessage(message: string, type: 'error' | 'success' = 'success') {
    this._webView.postMessage(
      createPostMessage('statusMessage', {
        statusMessage: message,
        statusMessageType: type,
      })
    );
  }
}
