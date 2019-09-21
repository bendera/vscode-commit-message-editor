import * as path from 'path';
import * as vscode from 'vscode';

interface EditorTabProps {
  extensionPath: string;
  platform: string;
  webview: vscode.Webview;
}

const EditorTab = ({ extensionPath, platform, webview }: EditorTabProps) => {
  const vscodeScriptUri = vscode.Uri.file(
    path.join(extensionPath, 'assets', 'scripts', 'tab.js')
  );
  const vscodeComponentsScriptUri = vscode.Uri.file(
    path.join(extensionPath, 'assets', 'scripts', 'components.js')
  );
  const vscodeStylesUri = vscode.Uri.file(
    path.join(extensionPath, 'assets', 'styles', 'tab.css')
  );
  const scriptsUri = webview.asWebviewUri(vscodeScriptUri);
  const componentsScriptUri = webview.asWebviewUri(vscodeComponentsScriptUri);
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
    <body class="${platform}">
      <div class="content">
        <div class="layout">
          <div class="col">
            <section class="section section--commit-message">
              <h2 class="section-title">Commit message</h2>
              <div class="editor-wrapper">
                <textarea id="message-box" class="message-box"></textarea><br>
                <div class="buttons">
                  <button type="submit" id="success-button" class="button primary-button">Save and close</button>
                  <button type="button" id="cancel-button" class="button secondary-button">Cancel</button>
                </div>
              </div>
            </section>
          </div>
          <div class="col">
            <section class="section section--recent-commits">
              <h2 class="section-title">Recent commits</h2>
              <div id="recent-commits-wrapper" class="recent-commits-wrapper is-loading">
                <div id="recent-commits-wrapper__loading" class="recent-commits-wrapper__loading">
                  <div class="recent-commits-wrapper__loading-icon"></div>
                </div>
                <div id="recent-commits-wrapper__commits" class="recent-commits-wrapper__commits"></div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <script src="${componentsScriptUri}"></script>
      <script src="${scriptsUri}"></script>
    </body>
    </html>
  `;

  return html;
};

export default EditorTab;
