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
import {ifDefined} from 'lit-html/directives/if-defined';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-button';
import '@bendera/vscode-webview-elements/dist/vscode-checkbox';
import '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import '@bendera/vscode-webview-elements/dist/vscode-form-control';
import '@bendera/vscode-webview-elements/dist/vscode-form-description';
import '@bendera/vscode-webview-elements/dist/vscode-form-item';
import '@bendera/vscode-webview-elements/dist/vscode-form-label';
import '@bendera/vscode-webview-elements/dist/vscode-option';
import '@bendera/vscode-webview-elements/dist/vscode-select';
import {VscodeInputbox} from '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import {VscodeSelect} from '@bendera/vscode-webview-elements/dist/vscode-select';
import {VscodeCheckbox} from '@bendera/vscode-webview-elements/dist/vscode-checkbox';
import store, {RootState} from '../store/store';
import {
  confirmAmend,
  closeTab,
  copyToSCMInputBox,
  formDataChanged,
} from '../store/actions';

type FormWidget = VscodeInputbox | VscodeSelect | VscodeCheckbox;

@customElement('cme-form-view')
export class FormView extends connect(store)(LitElement) {
  @internalProperty()
  private _saveAndClose = false;

  @internalProperty()
  private _tokens: Token[] = [];

  @internalProperty()
  private _amendCbChecked = false;

  @internalProperty()
  private _tokenValues: {[name: string]: string} = {};

  private _dynamicTemplate: string[] = [];
  private _tokenMap: {[name: string]: number} = {};

  stateChanged(state: RootState): void {
    const {config, tokenValues} = state;
    const {view, tokens, dynamicTemplate} = config;

    this._saveAndClose = view.saveAndClose;
    this._tokens = tokens;
    this._tokenValues = tokenValues;

    const tokenMap: {[name: string]: number} = {};

    tokens.forEach((token, index) => {
      tokenMap[token.name] = index;
    });

    this._tokenMap = tokenMap;
    this._dynamicTemplate = dynamicTemplate;
  }

  private _compileTemplate() {
    let compiled = this._dynamicTemplate.join('\n');
    const tokenNames = Object.keys(this._tokenValues);

    tokenNames.forEach((name) => {
      let value = this._tokenValues[name];
      const token = this._tokens[this._tokenMap[name]];
      const prefix = token.prefix || '';
      const suffix = token.suffix || '';
      value = value ? prefix + value + suffix : '';

      compiled = compiled.replace(new RegExp(`{${name}}`, 'g'), value);
    });

    compiled = compiled.replace(/\n{3,}/g, '\n');
    compiled = compiled.replace(/\n+$/g, '');

    return compiled;
  }

  private _renderFormItem(
    widget: TemplateResult,
    label: string,
    description = ''
  ) {
    let desc = nothing;

    if (description) {
      desc = html`<vscode-form-description
        >${description}</vscode-form-description
      >`;
    }

    return html`
      <vscode-form-item>
        <vscode-form-label>${label}</vscode-form-label>
        ${desc}
        <vscode-form-control> ${widget} </vscode-form-control>
      </vscode-form-item>
    `;
  }

  private _renderEnumTypeWidget(token: Token) {
    const {description, label, name} = token;

    const options = token.options?.map((op) => {
      const {label, value, description} = op;

      return html`
        <vscode-option
          value="${ifDefined(value)}"
          description="${ifDefined(description)}"
          >${label}</vscode-option
        >
      `;
    });

    const select = html`
      <vscode-select
        data-name="${name}"
        @vsc-change="${this._handleFormItemChange}"
        value="${this._tokenValues[name] || ''}"
        >${options}</vscode-select
      >
    `;

    return this._renderFormItem(select, label, description);
  }

  private _renderTextTypeWidget(token: Token) {
    const {description, label, multiline, name} = token;

    const inputbox = html`
      <vscode-inputbox
        data-name="${name}"
        ?multiline="${multiline}"
        @vsc-change="${this._handleFormItemChange}"
        value="${this._tokenValues[name] || ''}"
      ></vscode-inputbox>
    `;

    return this._renderFormItem(inputbox, label, description);
  }

  private _renderBooleanTypeWidget(token: Token) {
    const {description, label, name, value} = token;
    const checked =
      this._tokenValues[name] && this._tokenValues[name] !== '' ? true : false;

    const checkbox = html`
      <vscode-checkbox
        data-name="${name}"
        value="${value}"
        label="${label}"
        @vsc-change="${this._handleFormItemChange}"
        ?checked="${checked}"
      ></vscode-checkbox>
    `;

    return this._renderFormItem(checkbox, label, description);
  }

  private _handleFormItemChange(ev: CustomEvent) {
    const el = ev.target as FormWidget;
    const value = el.value;
    const name = el.dataset.name as string;

    if ((ev.target as Element).tagName.toLowerCase() === 'vscode-checkbox') {
      const {checked} = ev.detail;

      store.dispatch(
        formDataChanged({
          name,
          value: checked ? value : '',
        })
      );
    } else {
      store.dispatch(
        formDataChanged({
          name,
          value,
        })
      );
    }
  }

  private _handleSuccessButtonClick() {
    if (this._amendCbChecked) {
      store.dispatch(confirmAmend(this._compileTemplate()));
    } if (this._saveAndClose) {
      store.dispatch(closeTab());
    } else {
      store.dispatch(copyToSCMInputBox(this._compileTemplate()));
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
    const formElements = this._tokens.map((token) => {
      switch (token.type) {
        case 'enum':
          return this._renderEnumTypeWidget(token);
        case 'text':
          return this._renderTextTypeWidget(token);
        case 'boolean':
          return this._renderBooleanTypeWidget(token);
        default:
          return nothing;
      }
    });

    return html`
      <div id="edit-form">${formElements}</div>
      <div class="buttons">
        <vscode-button
          id="success-button-form"
          @click="${this._handleSuccessButtonClick}"
          >${this._saveAndClose ? 'Save and close' : 'Save'}</vscode-button
        >
        <vscode-button @click="${this._handleCancelButtonClick}"
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
