import * as path from 'path';
import * as vscode from 'vscode';
import getNonce from '../utils/getNonce';

type VisibleViewsConfig = 'text' | 'form' | 'both';

interface EditorTabProps {
  extensionPath: string;
  platform: string;
  webview: vscode.Webview;
  defaultView: string;
  showRecentCommits: boolean;
  saveAndClose: boolean;
}

const EditorTab = ({ extensionPath, platform, webview, defaultView, showRecentCommits, saveAndClose }: EditorTabProps) => {
  const assetUri = (fp: string) => {
    const fragments = fp.split('/');
    const vscodeUri = vscode.Uri.file(
      path.join(extensionPath, ...fragments)
    );

    return webview.asWebviewUri(vscodeUri);
  };

  const config = vscode.workspace.getConfiguration('commit-message-editor');
  const visibleViews: VisibleViewsConfig = config.get('view.visibleViews') || 'both';
  const { cspSource } = webview;
  const nonce = getNonce();
  const selectedTabIndex = defaultView === 'text' ? 0 : 1;

  let recentCommitsTemplate = '';

  if (showRecentCommits) {
    recentCommitsTemplate = `
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
    `;
  }

  const textareaTabHeader = `<header slot="header">Edit as text</header>`;

  const textareaTabContent = `
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
        <vscode-button id="success-button-text">${saveAndClose ? 'Save and close' : 'Save'}</vscode-button>
        <vscode-button id="cancel-button-text">Cancel</vscode-button>
        <vscode-checkbox
          label="Amend previous commit"
          class="cb-amend"
          id="text-amend-checkbox"
        ></vscode-checkbox>
      </div>
      ${recentCommitsTemplate}
    </section>
  `;

  const formTabHeader = `<header slot="header">Edit as form</header>`;

  const formTabContent = `
    <section>
      <div id="edit-form"></div>
      <div class="buttons">
        <vscode-button id="success-button-form">${saveAndClose ? 'Save and close' : 'Save'}</vscode-button>
        <vscode-button id="cancel-button-form">Cancel</vscode-button>
        <vscode-checkbox
          label="Amend previous commit"
          class="cb-amend"
          id="form-amend-checkbox"
        ></vscode-checkbox>
      </div>
    </section>
  `;

  let content = '';

  if (visibleViews === 'form') {
    content += formTabContent;
  } else if (visibleViews === 'text') {
    content += textareaTabContent;
  } else {
    content += `<vscode-tabs id="main-tabs" selectedindex="${selectedTabIndex}">`;
    content += textareaTabHeader;
    content += textareaTabContent;
    content += formTabHeader;
    content += formTabContent;
    content += '</vscode-tabs>'
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'none'; img-src ${cspSource}; script-src ${cspSource} nonce-${nonce}; style-src 'unsafe-inline' ${cspSource}; style-src-elem 'unsafe-inline' ${cspSource}; font-src ${cspSource}"
      />
      <title>Commit message editor</title>
      <link rel="stylesheet" href="${assetUri('assets/styles/tab.css')}" nonce="${nonce}">
      <link rel="stylesheet" href="${assetUri('node_modules/vscode-codicons/dist/codicon.css')}" nonce="${nonce}" id="vscode-codicon-stylesheet">
    </head>
    <body class="${platform}">
      <div class="content">
        <div class="layout">
          <div class="col">
            <section class="section section--commit-message">
              <div class="editor-wrapper">
                ${content}
              </div>
            </section>
          </div>
        </div>
      </div>
      <script src="${assetUri('node_modules/@bendera/vscode-webview-elements/dist/bundled.js')}" nonce="${nonce}" type="module"></script>
      <script src="${assetUri('assets/scripts/FormBuilder.js')}" nonce="${nonce}"></script>
      <script src="${assetUri('assets/scripts/TemplateParser.js')}" nonce="${nonce}"></script>
      <script src="${assetUri('assets/scripts/tab.js')}" nonce="${nonce}"></script>
    </body>
    </html>
  `;

  return html;
};

export default EditorTab;
