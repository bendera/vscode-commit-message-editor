import * as vscode from 'vscode';
import createPostMessage from '../utils/createPostMessage';
import getExtensionConfig from '../utils/getExtensionConfig';

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
        createPostMessage('receiveConfig', getExtensionConfig())
      );
    }
  );
};

export default createLoadTemplateCommand;
