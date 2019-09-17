import * as path from 'path';
import * as vscode from 'vscode';

interface EditorTabProps {
    extensionPath: string;
    webview: vscode.Webview;
}

const EditorTab = ({
    extensionPath,
    webview,
}: EditorTabProps) => {
    const vscodeScriptUri = vscode.Uri.file(path.join(extensionPath, 'assets', 'scripts', 'tab.js'));
    const vscodeStylesUri = vscode.Uri.file(path.join(extensionPath, 'assets', 'styles', 'tab.css'));
    const scriptsUri = webview.asWebviewUri(vscodeScriptUri);
    const stylesUri = webview.asWebviewUri(vscodeStylesUri);
    const { cspSource } = webview;

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta
                http-equiv="Content-Security-Policy"
                content="default-src 'none'; img-src ${cspSource} https:; script-src ${cspSource}; style-src ${cspSource};"
            />
            <title>Commit message editor</title>
            <link rel="stylesheet" href="${stylesUri}">
        </head>
        <body>
            <form id="edit-form">
                <textarea id="message-box"></textarea><br>
                <button type="submit" id="success-button">OK</button>
            </form>
            <script src="${scriptsUri}"></script>
        </body>
        </html>
    `;

    return html;
};

export default EditorTab;