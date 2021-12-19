import {html, TemplateResult, nothing} from 'lit';
import {ifDefined} from 'lit/directives/if-defined.js';
import '@bendera/vscode-webview-elements/dist/vscode-checkbox';
import '@bendera/vscode-webview-elements/dist/vscode-form-group';
import '@bendera/vscode-webview-elements/dist/vscode-form-helper';
import '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import '@bendera/vscode-webview-elements/dist/vscode-label';
import '@bendera/vscode-webview-elements/dist/vscode-multi-select';
import '@bendera/vscode-webview-elements/dist/vscode-option';
import '@bendera/vscode-webview-elements/dist/vscode-single-select';
import noop from '../../utils/noop';

class FormBuilder {
  set tokens(val: Token[]) {
    this._tokens = val;
  }

  get tokens(): Token[] {
    return this._tokens;
  }

  set formItemChangeHandler(fn: () => void) {
    this._handleFormItemChange = fn;
  }

  build(): TemplateResult[] {
    const formElements = this._tokens.map((token) => {
      switch (token.type) {
        case 'enum':
          return this._renderEnumTypeWidget(token);
        case 'text':
          return this._renderTextTypeWidget(token);
        case 'boolean':
          return this._renderBooleanTypeWidget(token);
        default:
          return html`${nothing}`;
      }
    });

    return formElements;
  }

  private _tokens: Token[] = [];

  private _handleFormItemChange: () => void = noop;

  private _renderFormItem(
    widget: TemplateResult,
    label: string,
    description = ''
  ) {
    let desc: TemplateResult = html`${nothing}`;

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

    const select = multiple
      ? html`
          <vscode-multi-select
            name="${name}"
            @vsc-change="${this._handleFormItemChange}"
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
            .combobox="${selectComboboxMode}"
            class="vscode-select"
            >${options}</vscode-single-select
          >
        `;

    return this._renderFormItem(select, label, description);
  }

  private _renderTextTypeWidget(token: Token) {
    const {description, label, multiline, name, lines, maxLines, maxLength} =
      token;
    const inputbox = html`
      <vscode-inputbox
        data-name="${name}"
        name="${name}"
        ?multiline="${multiline}"
        @vsc-change="${this._handleFormItemChange}"
        lines="${ifDefined(lines)}"
        maxLines="${ifDefined(maxLines)}"
        maxLength="${ifDefined(maxLength)}"
        style="width: 100%;"
      ></vscode-inputbox>
    `;

    return this._renderFormItem(inputbox, label, description);
  }

  private _renderBooleanTypeWidget(token: Token) {
    const {description, label, name, value} = token;

    const checkbox = html`
      <vscode-checkbox
        data-name="${name}"
        name="${name}"
        label="${label}"
        value="${ifDefined(value)}"
        @vsc-change="${this._handleFormItemChange}"
      ></vscode-checkbox>
    `;

    return this._renderFormItem(checkbox, label, description);
  }
}

export default FormBuilder;
