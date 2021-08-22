import {html, TemplateResult} from 'lit-element';
import {nothing} from 'lit-html';
import {ifDefined} from 'lit-html/directives/if-defined';
import '@bendera/vscode-webview-elements/dist/vscode-checkbox';
import '@bendera/vscode-webview-elements/dist/vscode-form-group';
import '@bendera/vscode-webview-elements/dist/vscode-form-helper';
import '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import '@bendera/vscode-webview-elements/dist/vscode-label';
import '@bendera/vscode-webview-elements/dist/vscode-multi-select';
import '@bendera/vscode-webview-elements/dist/vscode-option';
import '@bendera/vscode-webview-elements/dist/vscode-single-select';
import noop from '../../utils/noop';
import {TokenValueDTO} from './types';

class FormBuilder {
  set tokenValues(val: TokenValueDTO) {
    this._tokenValues = val;
  }

  get tokenValues(): TokenValueDTO {
    return this._tokenValues;
  }

  set tokens(val: Token[]) {
    this._tokens = val
  }

  get tokens(): Token[] {
    return this._tokens;
  }

  set formItemChangeHandler(fn: () => void) {
    this._handleFormItemChange = fn;
  }

  build(): typeof nothing | TemplateResult[] {
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

    return formElements;
  }

  private _tokens: Token[] = [];

  private _tokenValues: TokenValueDTO = {}

  private _handleFormItemChange: () => void = noop;

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
        ${desc} ${widget}
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
            name="${name}"
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
            name="${name}"
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
        name="${name}"
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
        name="${name}"
        value="${normalizedValue}"
        label="${label}"
        @vsc-change="${this._handleFormItemChange}"
        ?checked="${checked}"
      ></vscode-checkbox>
    `;

    return this._renderFormItem(checkbox, label, description);
  }
}

export default FormBuilder;
