import {LitElement, html, css, CSSResult, TemplateResult} from 'lit';
import {customElement, state, query, queryAll} from 'lit/decorators.js';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-button';
import '@bendera/vscode-webview-elements/dist/vscode-form-container';
import {VscodeFormContainer} from '@bendera/vscode-webview-elements/dist/vscode-form-container';
import {VscodeInputbox} from '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import store, {RootState} from '../../store/store';
import {
  confirmAmend,
  closeTab,
  copyToSCMInputBox,
  updateTokenValues,
} from '../../store/actions';
import {triggerInputboxRerender} from '../helpers';
import '../cme-repo-selector';
import FormBuilder from './FormBuilder';
import TemplateCompiler from './TemplateCompiler';
import {CodeEditor} from '../cme-code-editor/cme-code-editor';
import { RepoSelector } from '../cme-repo-selector';

@customElement('cme-form-view')
export class FormView extends connect(store)(LitElement) {
  visibleCallback(): void {
    const inputs = this.shadowRoot?.querySelectorAll(
      'vscode-inputbox[multiline]'
    );

    triggerInputboxRerender(inputs as NodeListOf<VscodeInputbox>);

    const monospaceEditors =
      this.shadowRoot?.querySelectorAll('cme-code-editor');

    if (monospaceEditors?.length) {
      monospaceEditors.forEach((m) => m.connectedCallback());
    }
  }

  @query('#form-container')
  private _formContainer!: VscodeFormContainer;

  @queryAll('cme-code-editor')
  private _codeEditors!: NodeListOf<CodeEditor>;

  @state()
  private _saveAndClose = false;

  @state()
  private _tokens: Token[] = [];

  @state()
  private _amendCbChecked = false;

  @state()
  private _tokenValues: {[name: string]: string | string[]} = {};

  @query('#form-view-repo-selector')
  private _repoSelector!: RepoSelector;

  private _dynamicTemplate: string[] = [];
  private _reduceEmptyLines = true;

  connectedCallback(): void {
    super.connectedCallback();

    this.updateComplete.then(() => {
      requestAnimationFrame(() => {
        this._updateTokenValues();
      });
    });
  }

  stateChanged(state: RootState): void {
    const {config, tokenValues} = state;
    const {view, tokens, dynamicTemplate, reduceEmptyLines} = config;

    this._saveAndClose = view.saveAndClose;
    this._tokens = tokens;
    this._tokenValues = tokenValues;
    this._dynamicTemplate = dynamicTemplate;
    this._reduceEmptyLines = reduceEmptyLines;
  }

  private _updateTokenValues() {
    const formData = this._formContainer.data;
    const payload: {[key: string]: string} = {};

    if (this._codeEditors.length > 0) {
      this._codeEditors.forEach((e) => {
        if (e.dataset.name) {
          formData[e.dataset.name] = e.value;
        }
      });
    }

    this._tokens.forEach((t) => {
      const {name, type, separator = ''} = t;
      const rawValue = formData[name];

      switch (type) {
        case 'enum':
          payload[name] = Array.isArray(rawValue)
            ? rawValue.join(separator)
            : rawValue;
          break;
        case 'text':
          payload[name] = String(rawValue);
          break;
        case 'boolean':
          if (Array.isArray(rawValue) && rawValue[0]) {
            payload[name] = rawValue[0];
          } else {
            payload[name] = '';
          }
          break;
        default:
      }
    });

    store.dispatch(updateTokenValues(payload));
  }

  private _handleFormItemChange() {
    this._updateTokenValues();
  }

  private _handleSuccessButtonClick() {
    const compiler = new TemplateCompiler(
      this._dynamicTemplate,
      this._tokens,
      this._tokenValues
    );
    compiler.reduceEmptyLines = this._reduceEmptyLines;
    const compiled = compiler.compile();

    const {selectedRepositoryPath} = this._repoSelector;

    if (this._amendCbChecked) {
      store.dispatch(confirmAmend(compiled));
    } else if (this._saveAndClose) {
      store.dispatch(
        copyToSCMInputBox({
          commitMessage: compiled,
          selectedRepositoryPath,
        })
      );
      store.dispatch(closeTab());
    } else {
      store.dispatch(
        copyToSCMInputBox({
          commitMessage: compiled,
          selectedRepositoryPath,
        })
      );
    }
  }

  private _handleCancelButtonClick() {
    store.dispatch(closeTab());
  }

  private _handleCheckBoxChange(ev: CustomEvent) {
    const {checked} = ev.detail;

    this._amendCbChecked = checked;
  }

  static get styles(): CSSResult {
    return css`
      .edit-form {
        margin: 0 auto;
      }

      .edit-form vscode-form-container {
        max-width: none;
        width: 100%;
      }

      .edit-form vscode-form-group {
        max-width: none;
        padding-left: 0;
        padding-right: 0;
      }

      .vscode-select {
        display: block;
      }

      cme-code-editor {
        margin-top: 9px;
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
    `;
  }

  render(): TemplateResult {
    const formBuilder = new FormBuilder();

    formBuilder.formItemChangeHandler = this._handleFormItemChange;
    formBuilder.tokens = this._tokens;

    const formElements = formBuilder.build();

    return html`
      <div id="edit-form" class="edit-form">
        <vscode-form-container id="form-container">
          ${formElements}
        </vscode-form-container>
      </div>
      <cme-repo-selector id="form-view-repo-selector"></cme-repo-selector>
      <div class="buttons">
        <vscode-button
          id="success-button-form"
          @click="${this._handleSuccessButtonClick}"
          >${this._saveAndClose ? 'Save and close' : 'Save'}</vscode-button
        >
        <vscode-button
          id="cancel-button-form"
          @click="${this._handleCancelButtonClick}"
          secondary
          >Cancel</vscode-button
        >
        <vscode-checkbox
          label="Amend previous commit"
          class="cb-amend"
          id="form-amend-checkbox"
          @vsc-change="${this._handleCheckBoxChange}"
        ></vscode-checkbox>
      </div>
    `;
  }
}
