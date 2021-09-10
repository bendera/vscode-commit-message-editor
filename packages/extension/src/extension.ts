import * as vscode from 'vscode';
import GitService from './utils/GitService';
import createOpenEditorCommand from './commands/createOpenEditorCommand';
import createCopyFromSCMInputBoxCommand from './commands/createCopyFromSCMInputBoxCommand';
import createLoadTemplateCommand from './commands/createLoadTemplateCommand';
import OpenSettingsPageCommand from './commands/OpenSettingsPageCommand';

export function activate(context: vscode.ExtensionContext) {
  const git = new GitService();
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  const openSettingsPageCommand = new OpenSettingsPageCommand({ context });

  context.subscriptions.push(
    createOpenEditorCommand({ context, currentPanel, git })
  );
  context.subscriptions.push(
    createCopyFromSCMInputBoxCommand({ currentPanel, git })
  );
  context.subscriptions.push(createLoadTemplateCommand({ currentPanel }));
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'commitMessageEditor.openSettingsPage',
      openSettingsPageCommand.run,
      openSettingsPageCommand
    )
  );
}

export function deactivate() {}
