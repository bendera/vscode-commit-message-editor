import {LitElement, html, css, CSSResult, TemplateResult} from 'lit';
import {customElement, state, query} from 'lit/decorators.js';
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
import '../cme-repo-info';
import FormBuilder from './FormBuilder';
import TemplateCompiler from './TemplateCompiler';

@customElement('cme-form-view')
export class FormView extends connect(store)(LitElement) {
  visibleCallback(): void {
    const inputs = this.shadowRoot?.querySelectorAll(
      'vscode-inputbox[multiline]'
    );

    triggerInputboxRerender(inputs as NodeListOf<VscodeInputbox>);
  }

  @query('#form-container')
  private _formContainer!: VscodeFormContainer;

  @state()
  private _saveAndClose = false;

  @state()
  private _tokens: Token[] = [];

  @state()
  private _amendCbChecked = false;

  @state()
  private _tokenValues: {[name: string]: string | string[]} = {};

  private _dynamicTemplate: string[] = [];

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
    const {view, tokens, dynamicTemplate} = config['commit-message-editor'];

    this._saveAndClose = view.saveAndClose;
    this._tokens = tokens;
    this._tokenValues = tokenValues;
    this._dynamicTemplate = dynamicTemplate;
  }

  private _updateTokenValues() {
    const formData = this._formContainer.data;
    const payload: {[key: string]: string} = {};

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
          payload[name] = rawValue[0];
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
    const compiled = compiler.compile();

    if (this._amendCbChecked) {
      store.dispatch(confirmAmend(compiled));
    } else if (this._saveAndClose) {
      store.dispatch(copyToSCMInputBox(compiled));
      store.dispatch(closeTab());
    } else {
      store.dispatch(copyToSCMInputBox(compiled));
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
      <cme-repo-info></cme-repo-info>
      <div class="buttons">
        <vscode-button
          id="success-button-form"
          @click="${this._handleSuccessButtonClick}"
          >${this._saveAndClose ? 'Save and close' : 'Save'}</vscode-button
        >
        <vscode-button
          id="cancel-button-form"
          @click="${this._handleCancelButtonClick}"
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
