import * as vscode from 'vscode';
import { GitExtension, API, Repository, APIState } from '../@types/git';

class GitService {
  private isGitAvailable: boolean = false;
  private gitExtension: vscode.Extension<GitExtension> | undefined;
  private api: API | undefined;

  constructor() {
    this.gitExtension = vscode.extensions.getExtension('vscode.git');

    if (!this.gitExtension) {
      return;
    }

    this.isGitAvailable = true;
    this.api = this.gitExtension.exports.getAPI(1);
  }

  private getSelectedRepository(): Repository | undefined {
    const selected = this.api?.repositories.find(
      (repo: Repository) => repo.ui.selected
    );

    if (selected) {
      return selected;
    }

    return this.api?.repositories[0];
  }

  public onRepositoryDidChange(handler: (e: void) => any, thisArgs?: any) {
    this.api?.repositories.forEach((repo) => {
      repo.ui.onDidChange(handler, thisArgs);
    });
  };

  public getNumberOfRepositories() {
    return this.api?.repositories.length || 0;
  }

  public getSelectedRepositoryPath() {
    const repo = this.getSelectedRepository();

    return repo?.rootUri.path;
  }

  public isAvailable(): boolean {
    return this.isGitAvailable;
  }

  public getSCMInputBoxMessage(): string {
    const repo = this.getSelectedRepository();

    if (repo) {
      return repo.inputBox.value;
    }

    return '';
  }

  public setSCMInputBoxMessage(message: string): void {
    const repo = this.getSelectedRepository();

    if (repo) {
      repo.inputBox.value = message;
    }
  }

  public async getRecentCommitMessages(limit: number = 32) {
    const repo = this.getSelectedRepository();
    let log;

    if (!repo) {
      return Promise.resolve([]);
    }

    try {
      log = await repo.log({ maxEntries: limit });
    } catch (er) {
      Promise.reject(er);
    }

    if (!log) {
      return Promise.resolve([]);
    }

    return Promise.resolve(log);
  }
}

export default GitService;
