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
import '@bendera/vscode-webview-elements/dist/vscode-form-container';
import '@bendera/vscode-webview-elements/dist/vscode-form-group';
import '@bendera/vscode-webview-elements/dist/vscode-form-helper';
import '@bendera/vscode-webview-elements/dist/vscode-label';
import '@bendera/vscode-webview-elements/dist/vscode-option';
import '@bendera/vscode-webview-elements/dist/vscode-multi-select';
import '@bendera/vscode-webview-elements/dist/vscode-single-select';
import {VscodeInputbox} from '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import {VscodeMultiSelect} from '@bendera/vscode-webview-elements/dist/vscode-multi-select';
import {VscodeSingleSelect} from '@bendera/vscode-webview-elements/dist/vscode-single-select';
import {VscodeCheckbox} from '@bendera/vscode-webview-elements/dist/vscode-checkbox';
import store, {RootState} from '../store/store';
import {
  confirmAmend,
  closeTab,
  copyToSCMInputBox,
  formDataChanged,
} from '../store/actions';
import {triggerInputboxRerender} from './helpers';
import './cme-repo-info';

type FormWidget =
  | VscodeInputbox
  | VscodeSingleSelect
  | VscodeMultiSelect
  | VscodeCheckbox;

interface VscodeSelectEventDetail {
  selectedIndex: number;
  selectedIndexes: number[];
  value: string | string[];
}

@customElement('cme-form-view')
export class FormView extends connect(store)(LitElement) {
  visibleCallback(): void {
    const inputs = this.shadowRoot?.querySelectorAll(
      'vscode-inputbox[multiline]'
    );

    triggerInputboxRerender(inputs as NodeListOf<VscodeInputbox>);
  }

  @internalProperty()
  private _saveAndClose = false;

  @internalProperty()
  private _tokens: Token[] = [];

  @internalProperty()
  private _amendCbChecked = false;

  @internalProperty()
  private _tokenValues: {[name: string]: string | string[]} = {};

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
    const tokenNames = this._tokens.map(({name}) => name);

    tokenNames.forEach((name) => {
      let value = this._tokenValues[name] || '';
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
      desc = html`<vscode-form-helper>${description}</vscode-form-helper>`;
    }

    return html`
      <vscode-form-group variant="settings-group">
        <vscode-label>${label}</vscode-label>
        ${desc}
        ${widget}
      </vscode-form-group>
    `;
  }

  private _renderEnumTypeWidget(token: Token) {
    const {description, label, name, multiple, combobox} = token;
    const selectComboboxMode = combobox || false;
    const selectValue = this._tokenValues[name];

    const options = token.options?.map((op) => {
      const {label, value, description} = op;
      const normalizedValue = value === undefined ? label : value;

      const selected = selectValue?.includes(normalizedValue);

      return html`
        <vscode-option
          value="${ifDefined(value)}"
          description="${ifDefined(description)}"
          ?selected="${selected}"
          >${label}</vscode-option
        >
      `;
    });

    const select = multiple
      ? html`
          <vscode-multi-select
            data-name="${name}"
            @vsc-change="${this._handleFormItemChange}"
            .value="${Array.isArray(selectValue) ? selectValue : []}"
            .combobox="${selectComboboxMode}"
            class="vscode-select"
            >${options}</vscode-multi-select
          >
        `
      : html`
          <vscode-single-select
            data-name="${name}"
            @vsc-change="${this._handleFormItemChange}"
            .value="${Array.isArray(selectValue) ? '' : selectValue}"
            .combobox="${selectComboboxMode}"
            class="vscode-select"
            >${options}</vscode-single-select
          >
        `;

    return this._renderFormItem(select, label, description);
  }

  private _renderTextTypeWidget(token: Token) {
    const {description, label, multiline, name, lines, maxLines} = token;
    const normalizedValue =
      typeof this._tokenValues[name] === 'string'
        ? this._tokenValues[name]
        : '';
    const inputbox = html`
      <vscode-inputbox
        data-name="${name}"
        ?multiline="${multiline}"
        @vsc-change="${this._handleFormItemChange}"
        value="${normalizedValue as string}"
        lines="${ifDefined(lines)}"
        maxLines="${ifDefined(maxLines)}"
        style="width: 100%;"
      ></vscode-inputbox>
    `;

    return this._renderFormItem(inputbox, label, description);
  }

  private _renderBooleanTypeWidget(token: Token) {
    const {description, label, name, value} = token;
    const checked =
      this._tokenValues[name] && this._tokenValues[name] !== '' ? true : false;
    const normalizedValue = typeof value === 'string' ? value : '';

    const checkbox = html`
      <vscode-checkbox
        data-name="${name}"
        value="${normalizedValue}"
        label="${label}"
        @vsc-change="${this._handleFormItemChange}"
        ?checked="${checked}"
      ></vscode-checkbox>
    `;

    return this._renderFormItem(checkbox, label, description);
  }

  private _handleFormItemChange(ev: CustomEvent) {
    const el = ev.target as FormWidget;
    const value = el.value as string;
    const name = el.dataset.name as string;
    const tagName = (ev.target as Element).tagName.toLowerCase();

    if (tagName === 'vscode-checkbox') {
      const {checked} = ev.detail;

      store.dispatch(
        formDataChanged({
          name,
          value: checked ? value : '',
        })
      );
    } else if (
      tagName === 'vscode-single-select' ||
      tagName === 'vscode-multi-select'
    ) {
      const detail: VscodeSelectEventDetail = ev.detail;
      const tokenConfig = this._tokens[this._tokenMap[name]];
      const separator = tokenConfig.separator || ', ';
      const normalizedValue = Array.isArray(detail.value)
        ? detail.value.join(separator)
        : detail.value;

      store.dispatch(
        formDataChanged({
          name,
          value: normalizedValue,
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
    } else if (this._saveAndClose) {
      store.dispatch(copyToSCMInputBox(this._compileTemplate()));
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
      <div id="edit-form">
        <vscode-form-container>
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
