import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
  internalProperty,
} from 'lit-element';
import {nothing} from 'lit-html';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-button';
import '@bendera/vscode-webview-elements/dist/vscode-checkbox';
import '@bendera/vscode-webview-elements/dist/vscode-icon';
import '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import {getAPI} from '../utils/VSCodeAPIService';
import {Commit} from '../@types/git';
import store, {RootState} from '../store/store';
import './cme-recent-commits';

const vscode = getAPI();

@customElement('cme-text-view')
export class TextView extends connect(store)(LitElement) {
  @property({type: Boolean}) saveAndClose = false;

  @internalProperty()
  private _showRecentCommits = false;

  @internalProperty()
  private _isCommitsLoading = true;

  @internalProperty()
  private _commits: {label: string; value: string}[] = [];

  @internalProperty()
  private _saveAndClose = false;

  @internalProperty()
  private _inputBoxValue = '';

  private _scmInputBoxValue = '';
  private _staticTemplate = '';

  private _getRecentCommits() {
    const state = vscode.getState() || {};

    if (state.commits) {
      this._isCommitsLoading = false;
      this._commits = this._transformCommitList(state.commits);
    } else {
      this._isCommitsLoading = true;

      vscode.postMessage({
        command: 'requestRecentCommits',
      });
    }
  }

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

  private _handleLoadTemplateButtonClick(ev: MouseEvent) {
    ev.stopPropagation();
    ev.preventDefault();
    this._inputBoxValue = this._staticTemplate;
  }

  private _handleCancelButtonClick() {
    vscode.postMessage({
      command: 'closeTab',
    });
  }

  private _handlePostMessages(ev: MessageEvent<ReceivedMessageDO>) {
    const {data} = ev;

    if (data.command === 'recentCommitMessages') {
      this._commits = this._transformCommitList(data.payload.commits);
      this._isCommitsLoading = false;
    }
  }

  private _handleSelect(ev: CustomEvent) {
    this._inputBoxValue = ev.detail;
  }

  stateChanged(state: RootState): void {
    const {config} = state;

    this._saveAndClose = config.view.saveAndClose;
    this._staticTemplate = config.staticTemplate.join('\n');
    this._showRecentCommits = config.view.showRecentCommits;

    if (this._scmInputBoxValue !== state.scmInputBoxValue) {
      this._scmInputBoxValue = state.scmInputBoxValue;

      if (this._inputBoxValue === '' && this._scmInputBoxValue !== '') {
        this._inputBoxValue = this._scmInputBoxValue;
      }
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('message', this._handlePostMessages.bind(this));
    this._getRecentCommits();
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

    if (this._showRecentCommits) {
      recentCommits = html`
        <cme-recent-commits
          .data="${this._commits}"
          ?loading="${this._isCommitsLoading}"
          @cme-select="${this._handleSelect}"
        ></cme-recent-commits>
      `;
    }

    return html`
      <div class="editor-toolbar">
        <p>
          <a
            href="#"
            title="Load configured template"
            @click="${this._handleLoadTemplateButtonClick}"
          >
            <vscode-icon name="file"></vscode-icon>Load template
          </a>
        </p>
      </div>
      <vscode-inputbox
        ?multiline="${true}"
        id="message-box"
        lines="10"
        maxlines="20"
        value="${this._inputBoxValue}"
      ></vscode-inputbox>
      <div class="buttons">
        <vscode-button id="success-button-text"
          >${this._saveAndClose ? 'Save and close' : 'Save'}</vscode-button
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
