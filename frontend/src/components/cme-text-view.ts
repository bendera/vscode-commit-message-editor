import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  internalProperty,
} from 'lit-element';
import {nothing} from 'lit-html';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-button';
import '@bendera/vscode-webview-elements/dist/vscode-checkbox';
import '@bendera/vscode-webview-elements/dist/vscode-icon';
import '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import store, {RootState} from '../store/store';
import './cme-code-editor/cme-code-editor';
import './cme-recent-commits';
import './cme-repo-info';
import {
  closeTab,
  confirmAmend,
  copyToSCMInputBox,
  recentCommitsRequest,
  textareaValueChanged,
} from '../store/actions';

@customElement('cme-text-view')
export class TextView extends connect(store)(LitElement) {
  @internalProperty()
  private _showRecentCommits = false;

  @internalProperty()
  private _isCommitsLoading = false;

  @internalProperty()
  private _commits: Commit[] | undefined = undefined;

  @internalProperty()
  private _saveAndClose = false;

  @internalProperty()
  private _inputBoxValue = '';

  @internalProperty()
  private _visibleLines = 10;

  private _staticTemplate = '';
  private _amendCbChecked = false;

  private _handleLoadTemplateButtonClick(ev: MouseEvent) {
    ev.stopPropagation();
    ev.preventDefault();
    store.dispatch(textareaValueChanged(this._staticTemplate));
  }

  private _handleInputBoxChange(ev: CustomEvent) {
    this._inputBoxValue = ev.detail;
    store.dispatch(textareaValueChanged(this._inputBoxValue));
  }

  private _handleSuccessButtonClick() {
    if (this._amendCbChecked) {
      store.dispatch(confirmAmend(this._inputBoxValue));
    } else if (this._saveAndClose) {
      store.dispatch(copyToSCMInputBox(this._inputBoxValue));
      store.dispatch(closeTab());
    } else {
      store.dispatch(copyToSCMInputBox(this._inputBoxValue));
    }
  }

  private _handleCancelButtonClick() {
    store.dispatch(closeTab());
  }

  private _handleCheckBoxChange(ev: CustomEvent) {
    const {checked} = ev.detail;

    this._amendCbChecked = checked;

    if (checked && this._commits && this._commits.length > 0) {
      store.dispatch(textareaValueChanged(this._commits[0].message));
    }
  }

  private _handleSelect(ev: CustomEvent) {
    store.dispatch(textareaValueChanged(ev.detail));
  }

  stateChanged(state: RootState): void {
    const {config} = state;

    this._saveAndClose = config.view.saveAndClose;
    this._staticTemplate = config.staticTemplate.join('\n');
    this._showRecentCommits = config.view.showRecentCommits;
    this._isCommitsLoading = state.recentCommitsLoading;
    this._inputBoxValue = state.textareaValue;
    this._visibleLines = config.view.visibleLines;

    if (state.recentCommits !== undefined && this._showRecentCommits) {
      this._commits = state.recentCommits;
    }

    if (
      state.recentCommits === undefined &&
      this._showRecentCommits &&
      !this._isCommitsLoading
    ) {
      store.dispatch(recentCommitsRequest());
    }
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (this._commits === undefined && this._showRecentCommits) {
      store.dispatch(recentCommitsRequest());
    }
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
        lines="${this._visibleLines}"
        maxLines="${this._visibleLines}"
        value="${this._inputBoxValue}"
        @vsc-change="${this._handleInputBoxChange}"
      ></vscode-inputbox>
      <cme-code-editor
        style="margin-top: 20px;"
        value="lorem\nipsum\ndolor\nsit\net\namur\nsadispcing\nconsectetur\ninteger\norci"
        lines="10"
        .rulers="${[50, 72]}"
      ></cme-code-editor>
      <cme-repo-info></cme-repo-info>
      <div class="buttons">
        <vscode-button @click="${this._handleSuccessButtonClick}"
          >${this._saveAndClose ? 'Save and close' : 'Save'}</vscode-button
        >
        <vscode-button @click="${this._handleCancelButtonClick}"
          >Cancel</vscode-button
        >
        <vscode-checkbox
          label="Amend previous commit"
          class="cb-amend"
          id="text-amend-checkbox"
          @vsc-change="${this._handleCheckBoxChange}"
        ></vscode-checkbox>
      </div>
      ${recentCommits}
    `;
  }
}
