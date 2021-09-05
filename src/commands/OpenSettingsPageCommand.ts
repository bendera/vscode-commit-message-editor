import * as fs from 'fs';
import * as util from 'util';
import * as vscode from 'vscode';
import Ajv from 'ajv';
import SettingsTab from '../webviews/SettingsTab';
import { ConfigurationTarget } from 'vscode';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class OpenSettingsPageCommand {
  private _currentPanel: vscode.WebviewPanel | undefined;
  private _context: vscode.ExtensionContext;

  constructor({ context }: { context: vscode.ExtensionContext }) {
    this._context = context;
  }

  run() {
    this._openPanel();
    this._activateWebviewMessageListener();
  }

  private async _readJSON(fp: string) {
    const buffer = await readFile(fp);
    const data = buffer.toString('utf-8');

    try {
      return JSON.parse(data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private async _readSchema() {
    return this._readJSON(
      this._context.asAbsolutePath('schemas/config-v1.schema.json')
    );
  }

  private async _processConfigFile() {
    const fileInfo = await vscode.window.showOpenDialog({
      canSelectMany: false,
      filters: {
        JSON: ['json'],
      },
    });

    if (!fileInfo) {
      return;
    }

    try {
      const config = await this._readJSON(fileInfo[0].fsPath);
      const schema = await this._readSchema();

      const ajv = new Ajv();
      const validate = ajv.compile(schema);
      const isValid = validate(config);

      if (!isValid) {
        throw new Error(ajv.errorsText(validate.errors));
      }

      return config;
    } catch (e) {
      if (e instanceof Error) {
        return Promise.reject(e.message);
      }

      return Promise.reject(e);
    }
  }

  private async _importConfig() {
    try {
      const config = await this._processConfigFile();

      this._currentPanel?.webview.postMessage({
        command: 'receiveImportedConfig',
        payload: config,
      });
    } catch (e) {
      this._currentPanel?.webview.postMessage({
        command: 'importedConfigError',
        payload: e,
      });
    }
  }

  private async _exportConfig(payload: any) {
    const fileInfo = await vscode.window.showSaveDialog({
      filters: {
        'JSON files': ['json'],
      },
    });
    const { staticTemplate, dynamicTemplate, tokens } = payload;
    const data = {
      configVersion: '1',
      staticTemplate,
      dynamicTemplate,
      tokens,
    };
    const content = JSON.stringify(data, null, 2);

    if (fileInfo?.fsPath) {
      await writeFile(fileInfo.fsPath, content, 'utf-8');
    }
  }

  private _loadCurrentConfig() {
    const rawConfig = vscode.workspace.getConfiguration(
      'commit-message-editor'
    );
    const { staticTemplate, dynamicTemplate, tokens } = rawConfig;

    this._currentPanel?.webview.postMessage({
      command: 'loadCurrentConfig',
      payload: {
        staticTemplate,
        dynamicTemplate,
        tokens,
      },
    });
  }

  private _saveToSettings(payload: {
    configurationTarget: ConfigurationTarget;
    configuration: {
      staticTemplate: string[];
      dynamicTemplate: string[];
      tokens: { [key: string]: any }[];
    };
  }) {
    const { configurationTarget, configuration } = payload;
    const { staticTemplate, dynamicTemplate, tokens } = configuration;

    vscode.workspace
      .getConfiguration('commit-message-editor')
      .update('staticTemplate', staticTemplate, configurationTarget);
    vscode.workspace
      .getConfiguration('commit-message-editor')
      .update('dynamicTemplate', dynamicTemplate, configurationTarget);
    vscode.workspace
      .getConfiguration('commit-message-editor')
      .update('tokens', tokens, configurationTarget);
  }

  private _webviewMessageListener(data: any) {
    const { command, payload } = data;

    switch (command) {
      case 'importConfig':
        this._importConfig();
        break;
      case 'exportConfig':
        this._exportConfig(payload);
        break;
      case 'loadCurrentConfig':
        this._loadCurrentConfig();
        break;
      case 'saveToSettings':
        this._saveToSettings(payload);
        break;
    }
  }

  private _activateWebviewMessageListener() {
    this._currentPanel?.webview.onDidReceiveMessage(
      this._webviewMessageListener,
      this,
      this._context.subscriptions
    );
  }

  private _openPanel() {
    const columnToShowIn = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : vscode.ViewColumn.One;

    if (this._currentPanel) {
      this._currentPanel.reveal(columnToShowIn);
    } else {
      this._currentPanel = vscode.window.createWebviewPanel(
        'cmeSettingsPage',
        'Commit Message Editor Settings',
        columnToShowIn as vscode.ViewColumn,
        { enableScripts: true, retainContextWhenHidden: true }
      );

      this._currentPanel.webview.html = SettingsTab({
        extensionPath: this._context.extensionPath,
        webview: this._currentPanel.webview,
      });

      this._currentPanel.onDidDispose(
        () => {
          this._currentPanel = undefined;
        },
        null,
        this._context.subscriptions
      );
    }
  }
}

export default OpenSettingsPageCommand;
