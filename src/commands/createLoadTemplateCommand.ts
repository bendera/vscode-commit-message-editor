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
        createPostMessage('receiveConfig', {
          staticTemplate: vscode.workspace
            .getConfiguration('commit-message-editor')
            .get('staticTemplate'),
          dynamicTemplate: vscode.workspace
            .getConfiguration('commit-message-editor')
            .get('dynamicTemplate'),
        })
      );
    }
  );
};

export default createLoadTemplateCommand;
