import * as vscode from 'vscode';

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

		panel.webview.html = getWebViewContent();
	});

	context.subscriptions.push(openEditor);
}

export function deactivate() {}

function getWebViewContent() {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Commit message editor</title>
</head>
<body>
	<textarea></textarea>
</body>
</html>`;
}
