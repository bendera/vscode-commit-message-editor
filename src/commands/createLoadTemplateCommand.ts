import * as vscode from 'vscode';
import createPostMessage from '../utils/createPostMessage';

const createLoadTemplateCommand = ({
  currentPanel,
}: {
  currentPanel: vscode.WebviewPanel | undefined;
}) => {
  return vscode.commands.registerCommand(
    'commitMessageEditor.loadTemplate',
    () => {
      if (!currentPanel) {
        return;
      }

      currentPanel.webview.postMessage(
        createPostMessage('receiveConfig', vscode.workspace.getConfiguration('commit-message-editor'))
      );
    }
  );
};

export default createLoadTemplateCommand;
