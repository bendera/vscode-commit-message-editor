import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  query,
  state,
  TemplateResult,
} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {nothing} from 'lit-html';
import '@bendera/vscode-webview-elements/dist/vscode-checkbox';
import '@bendera/vscode-webview-elements/dist/vscode-form-container';
import '@bendera/vscode-webview-elements/dist/vscode-form-group';
import '@bendera/vscode-webview-elements/dist/vscode-icon';
import '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import '@bendera/vscode-webview-elements/dist/vscode-label';
import '@bendera/vscode-webview-elements/dist/vscode-option';
import '@bendera/vscode-webview-elements/dist/vscode-single-select';
import {VscodeFormContainer} from '@bendera/vscode-webview-elements/dist/vscode-form-container';
import './cme-token-options-edit';

type TokenType = 'text' | 'enum' | 'boolean';

@customElement('cme-token-item-edit')
export class TokenItemEdit extends LitElement {
  @property({type: Object})
  set token(val: Token) {
    const {
      label,
      name,
      type,
      description,
      prefix,
      suffix,
      maxLength,
      maxLines,
      multiline,
      multiple,
      separator,
      combobox,
      options,
      lines,
    } = val;

    this._label = label;
    this._name = name;
    this._tokenType = type;
    this._description = description || '';
    this._prefix = prefix || '';
    this._suffix = suffix || '';
    this._maxLength = maxLength || 99999;
    this._maxLines = maxLines || 5;
    this._multiline = multiline || false;
    this._multiple = multiple || false;
    this._separator = separator || ', ';
    this._combobox = combobox || false;
    this._options = options || [];
    this._lines = lines || 2;
  }

  get token(): Token {
    return {
      label: this._label,
      name: this._name,
      type: this._tokenType,
      description: this._description,
      prefix: this._prefix,
      suffix: this._suffix,
      maxLength: this._maxLength,
      maxLines: this._maxLines,
      multiline: this._multiline,
      multiple: this._multiple,
      separator: this._separator,
      combobox: this._combobox,
      options: this._options,
      lines: this._lines,
    };
  }

  @property({type: Boolean})
  active = false;

  @state()
  private _label = this.token.label;

  @state()
  private _name = this.token.name;

  @state()
  private _tokenType: TokenType = this.token.type;

  @state()
  private _description = '';

  @state()
  private _prefix = this.token.prefix || '';

  @state()
  private _suffix = this.token.suffix || '';

  @state()
  private _multiline = this.token.multiline || false;

  @state()
  private _lines = this.token.lines || 2;

  @state()
  private _maxLines = this.token.maxLines || 5;

  @state()
  private _maxLength = this.token.maxLength || 99999;

  @state()
  private _multiple = this.token.multiple || false;

  @state()
  private _separator = this.token.separator || ', ';

  @state()
  private _combobox = this.token.combobox || false;

  @state()
  private _options: EnumTokenOption[] = this.token.options || [];

  @state()
  private _isOptionsWindowVisible = false;

  @query('#form')
  private _form!: VscodeFormContainer;

  private async _onFormChange() {
    await this.updateComplete;
    console.log(this._form.data);
  }

  private _onNameChange(ev: CustomEvent) {
    this._name = ev.detail;
  }

  private _onTokenTypeChange(ev: CustomEvent) {
    const val = (ev.detail.value as string).trim();

    this._tokenType = val as TokenType;
    this._onFormChange();
  }

  private _onMultilineChange(ev: CustomEvent) {
    this._multiline = ev.detail.checked;
    this._onFormChange();
  }

  private _onMultipleChange(ev: CustomEvent) {
    console.log(ev);
    this._multiple = ev.detail.checked;
  }

  private _onComboboxChange(ev: CustomEvent) {
    this._combobox = ev.detail.checked;
  }

  private _onEditClick() {
    this.active = true;
  }

  private _onOptionsButtonClick() {
    this._isOptionsWindowVisible = true;
  }

  private _onWindowClose() {
    this._isOptionsWindowVisible = false;
  }

  private _onOptionsSave(ev: CustomEvent<EnumTokenOption[]>) {
    console.log(ev.detail);
  }

  static get styles(): CSSResult {
    return css`
      .wrapper.active {
        background-color: var(--vscode-settings-focusedRowBackground);
        outline: 1px solid var(--vscode-settings-focusedRowBorder);
        outline-offset: -1px;
      }

      .default {
        box-sizing: border-box;
        cursor: default;
        display: flex;
        padding: 2px;
        width: 100%;
      }

      .default:hover {
        background-color: var(--vscode-list-hoverBackground);
      }

      .default-name {
        align-items: center;
        display: flex;
      }

      .default-controls {
        margin-left: auto;
      }

      vscode-form-container {
        max-width: none;
        padding-bottom: 26px;
        padding-top: 26px;
        position: relative;
      }

      vscode-form-group {
        margin: 0;
      }

      vscode-form-group:not(:last-child) {
        margin-bottom: 2px;
      }

      vscode-form-group.disabled {
        opacity: 0.3;
        pointer-events: none;
        user-select: none;
      }

      .edit-options-button {
        display: block;
        margin-top: 2px;
      }

      cme-token-options-edit {
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
      }
    `;
  }

  render(): TemplateResult {
    const labelWidget = html`
      <vscode-form-group>
        <vscode-label for="label">Label</vscode-label>
        <vscode-inputbox
          value="${this._label}"
          id="label"
          name="label"
          @vsc-change="${this._onFormChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const nameWidget = html`
      <vscode-form-group>
        <vscode-label for="name">Name</vscode-label>
        <vscode-inputbox
          value="${this._name}"
          id="name"
          name="name"
          @vsc-input="${this._onNameChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const typeWidget = html`
      <vscode-form-group variant="horizontal">
        <vscode-label for="type">Type:</vscode-label>
        <vscode-single-select
          id="type"
          name="type"
          @vsc-change="${this._onTokenTypeChange}"
        >
          <vscode-option ?selected="${this.token.type === 'text'}"
            >text</vscode-option
          >
          <vscode-option ?selected="${this.token.type === 'boolean'}"
            >boolean</vscode-option
          >
          <vscode-option ?selected="${this.token.type === 'enum'}"
            >enum</vscode-option
          >
        </vscode-single-select>
      </vscode-form-group>
    `;

    const multilineWidget = html`
      <vscode-form-group
        class="${classMap({disabled: this._tokenType !== 'text'})}"
      >
        <vscode-label for="multiline">Multiline</vscode-label>
        <vscode-checkbox
          id="multiline"
          name="flags"
          value="multiline"
          ?checked="${this._multiline}"
          @vsc-change="${this._onMultilineChange}"
        ></vscode-checkbox>
      </vscode-form-group>
    `;

    const descriptionWidget = html`
      <vscode-form-group>
        <vscode-label for="description">Description:</vscode-label>
        <vscode-inputbox
          id="description"
          value="${this._description}"
          name="description"
          multiline
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const prefixWidget = html`
      <vscode-form-group>
        <vscode-label for="prefix">Prefix</vscode-label>
        <vscode-inputbox
          value="${this._prefix}"
          id="prefix"
          name="prefix"
          @vsc-input="${this._onFormChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const suffixWidget = html`
      <vscode-form-group>
        <vscode-label for="suffix">Suffix</vscode-label>
        <vscode-inputbox
          value="${this._suffix}"
          id="suffix"
          name="suffix"
          @vsc-input="${this._onFormChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const linesWidget = html`
      <vscode-form-group
        class="${classMap({disabled: this._tokenType !== 'text'})}"
      >
        <vscode-label for="lines">Lines</vscode-label>
        <vscode-inputbox
          value="${this._lines}"
          id="lines"
          name="lines"
          type="number"
          min="1"
          @vsc-input="${this._onFormChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const maxLinesWidget = html`
      <vscode-form-group
        class="${classMap({disabled: this._tokenType !== 'text'})}"
      >
        <vscode-label for="maxLines">MaxLines</vscode-label>
        <vscode-inputbox
          value="${this._maxLines}"
          id="maxLines"
          name="maxLines"
          type="number"
          min="1"
          @vsc-input="${this._onFormChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const maxLengthWidget = html`
      <vscode-form-group
        class="${classMap({disabled: this._tokenType !== 'text'})}"
      >
        <vscode-label for="maxLength">MaxLength</vscode-label>
        <vscode-inputbox
          value="${this._maxLength}"
          id="maxLength"
          name="maxLength"
          type="number"
          min="1"
          @vsc-input="${this._onFormChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const multipleWidget = html`
      <vscode-form-group
        class="${classMap({disabled: this._tokenType !== 'enum'})}"
      >
        <vscode-label for="multiple">Multiple</vscode-label>
        <vscode-checkbox
          id="multiple"
          name="flags"
          value="multiple"
          ?checked="${this._multiple}"
          @vsc-change="${this._onMultipleChange}"
        ></vscode-checkbox>
      </vscode-form-group>
    `;

    const comboboxWidget = html`
      <vscode-form-group
        class="${classMap({disabled: this._tokenType !== 'enum'})}"
      >
        <vscode-label for="combobox">Combobox</vscode-label>
        <vscode-checkbox
          id="combobox"
          name="flags"
          value="combobox"
          ?checked="${this._combobox}"
          @vsc-change="${this._onComboboxChange}"
        ></vscode-checkbox>
      </vscode-form-group>
    `;

    const separatorWidget = html`
      <vscode-form-group
        class="${classMap({
          disabled: this._tokenType !== 'enum' || !this._multiple,
        })}"
      >
        <vscode-label for="separator">Separator</vscode-label>
        <vscode-inputbox
          value="${this._separator}"
          id="separator"
          name="separator"
          @vsc-input="${this._onFormChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const optionsWidget = html`
      <vscode-form-group
        class="${classMap({
          disabled: this._tokenType !== 'enum',
        })}"
      >
        <vscode-label>Options</vscode-label>
        <vscode-icon
          class="edit-options-button"
          name="list-unordered"
          action-icon
          @click="${this._onOptionsButtonClick}"
        ></vscode-icon>
      </vscode-form-group>
    `;

    const optionsWindow = html`
      <cme-token-options-edit
        @close="${this._onWindowClose}"
        @save="${this._onOptionsSave}"
        .options="${this._options}"
      ></cme-token-options-edit>
    `;

    const defaultView = html`
      <div class="default">
        <div class="default-name">${this._name}</div>
        <div class="default-controls">
          <vscode-icon
            name="edit"
            action-icon
            @click="${this._onEditClick}"
          ></vscode-icon>
          <vscode-icon name="x" action-icon></vscode-icon>
        </div>
      </div>
    `;

    const activeView = html`
      <div>
        <vscode-form-container id="form" responsive>
          ${nameWidget} ${labelWidget} ${typeWidget} ${descriptionWidget}
          ${prefixWidget} ${suffixWidget} ${multilineWidget} ${linesWidget}
          ${maxLinesWidget} ${maxLengthWidget} ${multipleWidget}
          ${separatorWidget} ${comboboxWidget} ${optionsWidget}
          ${this._isOptionsWindowVisible ? optionsWindow : nothing}
        </vscode-form-container>
      </div>
    `;

    return html`
      <div
        class="${classMap({
          wrapper: true,
          active: this.active,
        })}"
      >
        ${this.active ? activeView : defaultView}
      </div>
    `;
  }
}
