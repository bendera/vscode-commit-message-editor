import * as vscode from 'vscode';
import GitService from '../utils/GitService';
import UiApi from '../utils/UiApi';
import EditorController from './EditorController';

export default class CopyFromScmInputBoxCommand {
  constructor(
    private _git: GitService,
    private _editorController: EditorController
  ) {}

  run() {
    const { primaryEditorPanel } = this._editorController;

    if (primaryEditorPanel) {
      const ui = new UiApi(primaryEditorPanel.webview);
      ui.sendSCMInputBoxValue(this._git.getSCMInputBoxMessage());
    }
  }
}
