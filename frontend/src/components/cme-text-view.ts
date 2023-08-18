import {LitElement, html, css, CSSResult, nothing, TemplateResult} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-button';
import '@bendera/vscode-webview-elements/dist/vscode-checkbox';
import '@bendera/vscode-webview-elements/dist/vscode-icon';
import '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import {VscodeInputbox} from '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import CommitMessageFormatter, {
  CommitMessageFormatterOptions,
} from '@bendera/commit-message-formatter';
import store, {RootState} from '../store/store';
import {
  closeTab,
  confirmAmend,
  copyToSCMInputBox,
  recentCommitsRequest,
  textareaValueChanged,
} from '../store/actions';
import './cme-code-editor/cme-code-editor';
import './cme-recent-commits';
import './cme-repo-selector';
import {RepoSelector} from './cme-repo-selector';
import {triggerInputboxRerender} from './helpers';
import {Commit} from '../definitions';

@customElement('cme-text-view')
export class TextView extends connect(store)(LitElement) {
  visibleCallback(): void {
    const inputs = this.shadowRoot?.querySelectorAll(
      'vscode-inputbox[multiline]'
    );

    triggerInputboxRerender(inputs as NodeListOf<VscodeInputbox>);

    const monospaceEditor = this.shadowRoot?.querySelector('cme-code-editor');

    if (monospaceEditor) {
      monospaceEditor.connectedCallback();
    }
  }

  @state()
  private _showRecentCommits = false;

  @state()
  private _isCommitsLoading = false;

  @state()
  private _commits: Commit[] | undefined = undefined;

  @state()
  private _saveAndClose = false;

  @state()
  private _inputBoxValue = '';

  @state()
  private _useMonospaceEditor = false;

  @state()
  private _tabSize = 4;

  @state()
  private _useTabs = false;

  @state()
  private _rulers: number[] = [];

  @state()
  private _visibleLines = 10;

  @query('#text-view-repo-selector')
  private _repoSelector!: RepoSelector;

  private _staticTemplate = '';
  private _amendCbChecked = false;
  private _inputValidationLength = 72;
  private _inputValidationSubjectLength = 50;

  private _handleLoadTemplateButtonClick(ev: MouseEvent) {
    ev.stopPropagation();
    ev.preventDefault();
    store.dispatch(textareaValueChanged(this._staticTemplate));
  }

  private _handleWrapButtonClick(ev: MouseEvent) {
    ev.stopImmediatePropagation();
    ev.preventDefault();

    const options: CommitMessageFormatterOptions = {
      indentWithTabs: this._useTabs,
      lineLength: this._inputValidationSubjectLength,
      subjectLength: this._inputValidationLength,
      tabSize: this._tabSize,
    };

    const formatter = new CommitMessageFormatter(options);

    store.dispatch(textareaValueChanged(formatter.format(this._inputBoxValue)));
  }

  private _handleInputBoxChange(ev: CustomEvent) {
    this._inputBoxValue = ev.detail;
    store.dispatch(textareaValueChanged(this._inputBoxValue));
  }

  private _handleSuccessButtonClick() {
    const {selectedRepositoryPath} = this._repoSelector;
    const successAction = copyToSCMInputBox({
      commitMessage: this._inputBoxValue,
      selectedRepositoryPath,
    });

    if (this._amendCbChecked) {
      store.dispatch(confirmAmend(this._inputBoxValue));
    } else if (this._saveAndClose) {
      store.dispatch(successAction);
      store.dispatch(closeTab());
    } else {
      store.dispatch(successAction);
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

  private _handleRepositoryChange(ev: CustomEvent<string>) {
    store.dispatch(recentCommitsRequest(ev.detail));
  }

  stateChanged(state: RootState): void {
    const {config} = state;
    const {
      saveAndClose,
      showRecentCommits,
      useMonospaceEditor,
      tabSize,
      useTabs,
      visibleLines,
    } = config.view;

    this._saveAndClose = saveAndClose;
    this._staticTemplate = config.staticTemplate.join('\n');
    this._showRecentCommits = showRecentCommits;
    this._useMonospaceEditor = useMonospaceEditor;
    this._tabSize = tabSize;
    this._useTabs = useTabs;
    this._inputValidationLength = config.inputValidationLength;
    this._inputValidationSubjectLength = config.inputValidationSubjectLength;
    this._rulers = [
      this._inputValidationSubjectLength,
      this._inputValidationLength,
    ];
    this._visibleLines = visibleLines;
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
      .inputbox {
        width: 100%;
      }

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
        margin-right: 5px;
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

    const inputbox = html`
      <vscode-inputbox
        ?multiline="${true}"
        id="message-box"
        lines="${this._visibleLines}"
        maxlines="${this._visibleLines}"
        value="${this._inputBoxValue}"
        @vsc-change="${this._handleInputBoxChange}"
        class="inputbox"
      ></vscode-inputbox>
    `;

    const monospaceEditor = html`
      <cme-code-editor
        value="${this._inputBoxValue}"
        lines="${this._visibleLines}"
        tabsize="${this._tabSize}"
        .useTabs="${this._useTabs}"
        .rulers="${this._rulers}"
        @vsc-change="${this._handleInputBoxChange}"
      ></cme-code-editor>
    `;

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
          <a
            href="#"
            title="Wrap lines"
            @click="${this._handleWrapButtonClick}"
          >
            <vscode-icon name="list-flat"></vscode-icon>Wrap
          </a>
        </p>
      </div>
      ${this._useMonospaceEditor ? monospaceEditor : inputbox}
      <cme-repo-selector
        id="text-view-repo-selector"
        @cme-change=${this._handleRepositoryChange}
      ></cme-repo-selector>
      <div class="buttons">
        <vscode-button @click="${this._handleSuccessButtonClick}"
          >${this._saveAndClose ? 'Save and close' : 'Save'}</vscode-button
        >
        <vscode-button @click="${this._handleCancelButtonClick}" secondary
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
