import * as path from 'path';
import * as vscode from 'vscode';

interface EditorTabProps {
  extensionPath: string;
  platform: string;
  webview: vscode.Webview;
}

const getNonce = () => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const EditorTab = ({ extensionPath, platform, webview }: EditorTabProps) => {
  const assetUri = (fp: string) => {
    const fragments = fp.split('/');
    const vscodeUri = vscode.Uri.file(
      path.join(extensionPath, ...fragments)
    );

    return webview.asWebviewUri(vscodeUri);
  };

  const { cspSource } = webview;
  const nonce = getNonce();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'none'; img-src ${cspSource}; script-src 'self' ${cspSource} nonce-${nonce}; style-src 'unsafe-inline' 'self' ${cspSource};"
      />
      <title>Commit message editor</title>
      <link rel="stylesheet" href="${assetUri('assets/styles/tab.css')}" nonce="${nonce}">
    </head>
    <body class="${platform}">
      <div class="content">
        <div class="layout">
          <div class="col">
            <section class="section section--commit-message">
              <h2 class="section-title">Commit message</h2>
              <p>Every line that begins with &quot;#&quot; will be ignored</p>
              <div class="editor-wrapper">
                <greeter-element nonce=${nonce}></greeter-element>
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
              <p>&nbsp;</p>
              <div id="recent-commits-wrapper" class="recent-commits-wrapper is-loading">
                <div id="recent-commits-wrapper__loading" class="recent-commits-wrapper__loading">
                  <div class="recent-commits-wrapper__loading-icon"></div>
                </div>
                <div id="recent-commits-wrapper__commits" class="recent-commits-wrapper__commits">
                  <vscode-scrollable>
                    <vscode-tree id="recent-commits-wrapper__commits-list"></vscode-tree>
                  </vscode-scrollable>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <script src="${assetUri('assets/vsc-we/vsc-we.js')}" nonce="${nonce}"></script>
      <script src="${assetUri('assets/scripts/tab.js')}" nonce="${nonce}"></script>
    </body>
    </html>
  `;

  return html;
};

export default EditorTab;
