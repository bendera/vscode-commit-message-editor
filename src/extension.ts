import * as vscode from 'vscode';
import GitService from './utils/GitService';
import createOpenEditorCommand from './commands/createOpenEditorCommand';
import createCopyFromSCMInputBoxCommand from './commands/createCopyFromSCMInputBoxCommand';
import createLoadTemplateCommand from './commands/createLoadTemplateCommand';

export function activate(context: vscode.ExtensionContext) {
  const git = new GitService();
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  context.subscriptions.push(createOpenEditorCommand({ context, currentPanel, git }));
  context.subscriptions.push(createCopyFromSCMInputBoxCommand({ currentPanel, git }));
  context.subscriptions.push(createLoadTemplateCommand({ currentPanel }));
}

export function deactivate() {}
