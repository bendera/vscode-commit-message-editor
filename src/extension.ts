import * as vscode from 'vscode';
import GitService from './utils/GitService';
import EditorController from './commands/EditorController';
import SettingsPageController from './commands/SettingsPageController';
import CopyFromScmInputBoxCommand from './commands/CopyFromScmInputBoxCommand';
import { Command } from './definitions';
import Logger from './utils/Logger';

export async function activate(context: vscode.ExtensionContext) {
  const logger = new Logger();
  const git = new GitService();

  const editorController = new EditorController(context, git, logger);
  const settingsPageController = new SettingsPageController(context);

  const copyFromScmInputBoxCommand = new CopyFromScmInputBoxCommand(
    git,
    editorController
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      Command.OpenEditor,
      editorController.openInTheMainView,
      editorController
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      Command.OpenSettings,
      settingsPageController.run,
      settingsPageController
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      Command.CopyFromScmInputBox,
      copyFromScmInputBoxCommand.run,
      copyFromScmInputBoxCommand
    )
  );

  logger.log('Extension has been activated');
}

export function deactivate() {}
