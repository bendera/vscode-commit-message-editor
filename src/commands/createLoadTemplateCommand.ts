import * as vscode from 'vscode';
import createPostMessage from '../utils/createPostMessage';

const createLoadTemplateCommand = ({
  currentPanel,
}: {
  currentPanel: vscode.WebviewPanel | undefined,
}) => {
  return vscode.commands.registerCommand(
    'commitMessageEditor.loadTemplate',
    () => {
      if (!currentPanel) {
        return;
      }

      currentPanel.webview.postMessage(
        createPostMessage('receiveConfig', {
          template: vscode.workspace.getConfiguration('commit-message-editor').get('template'),
        })
      );
    }
  );
};

export default createLoadTemplateCommand;
