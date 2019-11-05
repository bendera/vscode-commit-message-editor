import * as vscode from 'vscode';
import createPostMessage from '../utils/createPostMessage';
import GitService from '../utils/GitService';

const createCopyFromSCMInputBoxCommand = ({
  currentPanel,
  git,
}: {
  currentPanel: vscode.WebviewPanel | undefined;
  git: GitService;
}) => {
  return vscode.commands.registerCommand(
    'commitMessageEditor.copyFromSCMInputBox',
    () => {
      if (!currentPanel) {
        return;
      }

      currentPanel.webview.postMessage(createPostMessage('copyFromSCMInputBox', {
        inputBoxValue: git.getSCMInputBoxMessage(),
      }));
    }
  );
};

export default createCopyFromSCMInputBoxCommand;
