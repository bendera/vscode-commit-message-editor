import * as vscode from 'vscode';
import EditorTab from './views/EditorTab';

export function activate(context: vscode.ExtensionContext) {
	const openEditor: vscode.Disposable = vscode.commands.registerCommand('commitMessageEditor.openEditor', () => {
		const panel = vscode.window.createWebviewPanel(
			'editCommitMessage',
			'Edit commit message',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
			}
		);

		panel.webview.html = EditorTab();
	});

	context.subscriptions.push(openEditor);
}

export function deactivate() {}
