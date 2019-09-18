import { platform } from 'os';
import * as vscode from 'vscode';
import EditorTab from './views/EditorTab';
import GitService from './GitService';

export function activate(context: vscode.ExtensionContext) {
	const git = new GitService();
	let currentPanel: vscode.WebviewPanel;

	const openEditor: vscode.Disposable = vscode.commands.registerCommand('commitMessageEditor.openEditor', () => {
		currentPanel = vscode.window.createWebviewPanel(
			'editCommitMessage',
			'Edit commit message',
			vscode.ViewColumn.Active,
			{
				enableScripts: true,
			}
		);
		const { webview } = currentPanel;
		const { extensionPath } = context;

		currentPanel.webview.html = EditorTab({
			extensionPath,
			webview,
			platform: platform(),
		});

		currentPanel.webview.onDidReceiveMessage(
			(data) => {
				if (data.command === 'copyFromExtensionMessageBox') {
					git.setSCMInputBoxMessage(data.payload);
				}
			}, 
			undefined, 
			context.subscriptions
		);
	});

	const copyFromSCMInputBox: vscode.Disposable = vscode.commands.registerCommand('commitMessageEditor.copyFromSCMInputBox', () => {
		currentPanel.webview.postMessage({
			command: 'copyFromSCMInputBox',
			payload: {
				inputBoxValue: git.getSCMInputBoxMessage(),
			}
		});
	});

	context.subscriptions.push(openEditor);
	context.subscriptions.push(copyFromSCMInputBox);
}

export function deactivate() { }
