import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
} from 'lit-element';
import {nothing} from 'lit-html';
import '@bendera/vscode-webview-elements/dist/vscode-button';
import '@bendera/vscode-webview-elements/dist/vscode-checkbox';
import '@bendera/vscode-webview-elements/dist/vscode-icon';
import '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import {Commit} from '../@types/git';
import './cme-recent-commits';

@customElement('cme-text-view')
export class TextView extends LitElement {
  @property({type: Boolean}) saveAndClose = false;
  @property({type: Boolean}) showRecentCommits = true;
  @property({type: Array}) commits: Commit[] = [];

  private _vscode = window.acquireVsCodeApi();

  private _transformCommitList(commits: Commit[]) {
    return commits.map((item) => {
      const {message} = item;
      const lines = message.split('\n');

      return {
        label: lines[0],
        value: message,
      };
    });
  }

  private _handleCancelButtonClick() {
    this._vscode.postMessage({
      command: 'closeTab',
    });
  }

  static get styles(): CSSResult {
    return css`
      .editor-toolbar {
        display: block;
        overflow: visible;
      }

      .editor-toolbar p {
        color: var(--vscode-descriptionForeground);
        margin: 10px 0;
      }

      .editor-toolbar a {
        align-items: center;
        color: var(--vscode-textLink-foreground);
        display: inline-flex;
        outline-color: var(--vscode-focusBorder);
        text-decoration: none;
      }

      .editor-toolbar a:hover,
      .editor-toolbar a:focus,
      .editor-toolbar a:active {
        color: var(--vscode-textLink-activeForeground);
      }

      .editor-toolbar vscode-icon {
        cursor: pointer;
        margin-right: 2px;
      }

      .buttons {
        align-items: center;
        display: flex;
        margin-top: 10px;
      }

      .buttons .cb-amend {
        margin-left: 20px;
      }

      .buttons vscode-button {
        margin-right: 10px;
      }

      cme-recent-commits {
        margin-top: 30px;
      }
    `;
  }

  render(): TemplateResult {
    let recentCommits: TemplateResult | typeof nothing = nothing;

    if (this.showRecentCommits) {
      const commits = this._transformCommitList(this.commits);
      recentCommits = html`
        <cme-recent-commits .data="${commits}"></cme-recent-commits>
      `;
    }

    return html`
      <div class="editor-toolbar">
        <p>
          <a href="#" title="Load configured template">
            <vscode-icon name="file"></vscode-icon>Load template
          </a>
        </p>
      </div>
      <vscode-inputbox
        multiline="true"
        id="message-box"
        lines="10"
        maxlines="20"
      ></vscode-inputbox>
      <div class="buttons">
        <vscode-button id="success-button-text"
          >${this.saveAndClose ? 'Save and close' : 'Save'}</vscode-button
        >
        <vscode-button
          id="cancel-button-text"
          @click="${this._handleCancelButtonClick}"
          >Cancel</vscode-button
        >
        <vscode-checkbox
          label="Amend previous commit"
          class="cb-amend"
          id="text-amend-checkbox"
        ></vscode-checkbox>
      </div>
      ${recentCommits}
    `;
  }
}
