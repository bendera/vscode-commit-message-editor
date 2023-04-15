import * as vscode from 'vscode';
import { GitExtension, API, Repository, APIState } from '../@types/git';

export type RepositoryChangeCallback = (repositoryInfo: {
  numberOfRepositories: number;
  selectedRepositoryPath: string;
}) => void;

export interface RepositoryInfo {
  numberOfRepositories: number;
  selectedRepositoryPath: string;
}

class GitService {
  private isGitAvailable: boolean = false;
  private gitExtension: vscode.Extension<GitExtension> | undefined;
  private api: API | undefined;
  private disposables: vscode.Disposable[] = [];

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

  private getRepositoryByPath(path: string): Repository | undefined {
    const repository = this.api?.repositories.find(
      (r: Repository) => r.rootUri.path === path
    );

    if (repository) {
      return repository;
    }
  }

  public onRepositoryDidChange(handler: RepositoryChangeCallback) {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];

    this.api?.repositories.forEach((repo) => {
      this.disposables.push(
        repo.ui.onDidChange(() => {
          if (repo.ui.selected) {
            handler({
              numberOfRepositories: this.getNumberOfRepositories(),
              selectedRepositoryPath: repo.rootUri.path,
            });
          }
        }, this)
      );
    });
  }

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

  public async getRepositoryRecentCommitMessages(
    repository: Repository,
    limit: number = 32
  ) {
    let log;

    try {
      log = await repository.log({ maxEntries: limit });
    } catch (er) {
      throw er;
    }

    if (!log) {
      return [];
    }

    return log;
  }

  public async getRecentCommitMessages(limit: number = 32) {
    const repo = this.getSelectedRepository();

    if (!repo) {
      return [];
    }

    return this.getRepositoryRecentCommitMessages(repo, limit);
  }

  public async getRecentCommitMessagesByPath(path: string, limit = 32) {
    const repo = this.getRepositoryByPath(path);

    if (!repo) {
      return [];
    }

    return this.getRepositoryRecentCommitMessages(repo, limit);
  }
}

export default GitService;
