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
              <div class="editor-wrapper">
                <vscode-tabs>
                  <header slot="header">Edit as text</header>
                  <section>
                    <div class="editor-toolbar">
                      <p><a href="#" title="Load configured template" id="load-template-button"><vscode-icon name="file"></vscode-icon>Load template</a></p>
                    </div>
                    <vscode-inputbox
                      multiline="true"
                      id="message-box"
                      lines="10"
                      maxlines="20"
                    ></vscode-inputbox>
                    <div class="buttons">
                      <button type="submit" id="success-button-text" class="button primary-button">Save</button>
                      <button type="button" id="cancel-button-text" class="button secondary-button">Close</button>
                    </div>
                    <div class="recent-commits">
                      <h2 class="recent-commits__title">Recent commits:</h2>
                      <div id="recent-commits-wrapper" class="recent-commits-wrapper is-loading">
                        <div id="recent-commits-wrapper__loading" class="recent-commits-wrapper__loading">
                          <div class="recent-commits-wrapper__loading-icon"></div>
                        </div>
                        <div id="recent-commits-wrapper__commits" class="recent-commits-wrapper__commits">
                          <vscode-tree id="recent-commits-wrapper__commits-list" tabindex="0"></vscode-tree>
                        </div>
                      </div>
                    </div>
                  </section>
                  <header slot="header">Edit as form</header>
                  <section>
                    <div id="edit-form"></div>
                    <div class="buttons">
                      <button type="submit" id="success-button-form" class="button primary-button">Save</button>
                      <button type="button" id="cancel-button-form" class="button secondary-button">Close</button>
                    </div>
                  </section>
                </vscode-tabs>
              </div>
            </section>
          </div>
        </div>
      </div>
      <script src="${assetUri('assets/vsc-we/vsc-we.js')}" nonce="${nonce}"></script>
      <script src="${assetUri('assets/scripts/FormBuilder.js')}" nonce="${nonce}"></script>
      <script src="${assetUri('assets/scripts/TemplateParser.js')}" nonce="${nonce}"></script>
      <script src="${assetUri('assets/scripts/tab.js')}" nonce="${nonce}"></script>
    </body>
    </html>
  `;

  return html;
};

export default EditorTab;
