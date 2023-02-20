import {css, CSSResult, html, LitElement, nothing, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import '@bendera/vscode-webview-elements/dist/vscode-checkbox';
import '@bendera/vscode-webview-elements/dist/vscode-form-container';
import '@bendera/vscode-webview-elements/dist/vscode-form-group';
import '@bendera/vscode-webview-elements/dist/vscode-icon';
import '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import '@bendera/vscode-webview-elements/dist/vscode-label';
import '@bendera/vscode-webview-elements/dist/vscode-option';
import '@bendera/vscode-webview-elements/dist/vscode-single-select';
import './cme-token-options-edit';

const isUndefined = (val: unknown): boolean => {
  return val === null || val === void 0;
};

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
      maxLineLength,
      multiline,
      monospace,
      multiple,
      separator,
      combobox,
      options,
      lines,
      value,
    } = val;

    this._label = label ?? 'Untitled';
    this._name = name ?? 'untitled';
    this._type = type ?? 'text';
    this._description = description ?? '';
    this._prefix = prefix ?? '';
    this._suffix = suffix ?? '';
    this._maxLength = !isUndefined(maxLength) ? String(maxLength) : '';
    this._maxLines = !isUndefined(maxLines) ? String(maxLines) : '';
    this._multiline = multiline ?? false;
    this._multiple = multiple ?? false;
    this._separator = separator ?? '';
    this._combobox = combobox ?? false;
    this._options = options ?? [];
    this._lines = !isUndefined(lines) ? String(lines) : '';
    this._value = value ?? '';
  }

  get token(): Token {
    const retval: Token = {
      label: this._label ?? 'Untitled',
      name: this._name ?? 'untitled',
      type: this._type ?? 'text',
    };

    if (this._value.length > 0) {
      retval.value = this._value;
    }

    if (this._description.length > 0) {
      retval.description = this._description;
    }

    if (this._prefix.length > 0) {
      retval.prefix = this._prefix;
    }

    if (this._suffix.length > 0) {
      retval.suffix = this._suffix;
    }

    if (this._maxLength.length) {
      retval.maxLength = parseInt(this._maxLength);
    }

    if (this._maxLines.length > 0) {
      retval.maxLines = parseInt(this._maxLines);
    }

    if (this._multiline) {
      retval.multiline = true;
    }

    if (this._lines.length > 0) {
      retval.lines = parseInt(this._lines);
    }

    if (this._multiple) {
      retval.multiple = true;
    }

    if (this._separator.length > 0) {
      retval.separator = this._separator;
    }

    if (this._combobox) {
      retval.combobox = true;
    }

    if (this._options.length > 0) {
      retval.options = this._options;
    }

    return retval;
  }

  @property({type: Boolean})
  active = false;

  @state()
  private _label = '';

  @state()
  private _name = '';

  @state()
  private _type: TokenType = 'text';

  @state()
  private _description = '';

  @state()
  private _prefix = '';

  @state()
  private _suffix = '';

  @state()
  private _multiline = false;

  @state()
  private _monospace = false;

  @state()
  private _lines = '';

  @state()
  private _maxLines = '';

  @state()
  private _maxLength = '';

  @state()
  private maxLineLength = '';

  @state()
  private _multiple = false;

  @state()
  private _separator = '';

  @state()
  private _combobox = false;

  @state()
  private _options: EnumTokenOption[] = [];

  @state()
  private _value = '';

  @state()
  private _isOptionsWindowVisible = false;

  private _onNameChange(ev: CustomEvent) {
    this._name = ev.detail;
  }

  private _onValueChange(ev: CustomEvent) {
    this._value = ev.detail;
  }

  private _onLabelChange(ev: CustomEvent) {
    this._label = ev.detail;
  }

  private _onTokenTypeChange(ev: CustomEvent) {
    const val = (ev.detail.value as string).trim();

    this._type = val as TokenType;
  }

  private _onDescriptionChange(ev: CustomEvent) {
    this._description = ev.detail;
  }

  private _onPrefixChange(ev: CustomEvent) {
    this._prefix = ev.detail;
  }

  private _onSuffixChange(ev: CustomEvent) {
    this._suffix = ev.detail;
  }

  private _onMultilineChange(ev: CustomEvent) {
    this._multiline = ev.detail.checked;
  }

  private _onMonospaceChange(ev: CustomEvent) {
    this._monospace = ev.detail.checked;
  }

  private _onLinesChange(ev: CustomEvent) {
    this._lines = ev.detail;
  }

  private _onMaxLinesChange(ev: CustomEvent) {
    this._maxLines = ev.detail;
  }

  private _onMaxLengthChange(ev: CustomEvent) {
    this._maxLength = ev.detail;
  }

  private _onMultipleChange(ev: CustomEvent) {
    this._multiple = ev.detail.checked;
  }

  private _onSeparatorChange(ev: CustomEvent) {
    this._separator = ev.detail;
  }

  private _onComboboxChange(ev: CustomEvent) {
    this._combobox = ev.detail.checked;
  }

  private _onOptionsButtonClick() {
    this._isOptionsWindowVisible = true;
  }

  private _onOptionsSave(ev: CustomEvent<EnumTokenOption[]>) {
    this._options = ev.detail;
  }

  private _onEditClick() {
    this.active = true;
  }

  private _onDeleteClick() {
    this.dispatchEvent(
      new CustomEvent('delete', {
        detail: {
          index: this.dataset.index ? Number(this.dataset.index) : -1,
        },
      })
    );
  }

  private _onWindowClose() {
    this._isOptionsWindowVisible = false;
  }

  private _onSaveClick() {
    this.dispatchEvent(
      new CustomEvent('save', {
        detail: {
          index: this.dataset.index ? Number(this.dataset.index) : -1,
          data: this.token,
        },
      })
    );
    this.active = false;
  }

  private _onCancelClick() {
    this.active = false;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }

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
        margin-bottom: 20px;
        max-width: none;
        padding-bottom: 26px;
        padding-top: 26px;
        position: relative;
      }

      vscode-form-group {
        margin: 0;
      }

      vscode-form-group:not(:last-child) {
        margin-bottom: 10px;
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
        inset: 0;
        position: absolute;
        z-index: 1;
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
          @vsc-input="${this._onLabelChange}"
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

    const valueWidget = html`
      <vscode-form-group
        class="${classMap({disabled: this._type !== 'boolean'})}"
      >
        <vscode-label for="value">Value</vscode-label>
        <vscode-inputbox
          value="${this._value}"
          id="value"
          name="value"
          @vsc-input="${this._onValueChange}"
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
      <vscode-form-group class="${classMap({disabled: this._type !== 'text'})}">
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

    const monospaceWidget = html`
      <vscode-form-group class="${classMap({disabled: this._type !== 'text' || !this._multiline})}">
        <vscode-label for="monospace">Monospace</vscode-label>
        <vscode-checkbox
          id="monospace"
          name="flags"
          value="monospace"
          ?checked="${this._monospace}"
          @vsc-change="${this._onMonospaceChange}"
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
          @vsc-input="${this._onDescriptionChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const prefixWidget = html`
      <vscode-form-group>
        <vscode-label for="prefix">Prefix</vscode-label>
        <vscode-inputbox
          value="${this._prefix}"
          id="prefix"
          multiline
          name="prefix"
          @vsc-input="${this._onPrefixChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const suffixWidget = html`
      <vscode-form-group>
        <vscode-label for="suffix">Suffix</vscode-label>
        <vscode-inputbox
          value="${this._suffix}"
          id="suffix"
          multiline
          name="suffix"
          @vsc-input="${this._onSuffixChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const linesWidget = html`
      <vscode-form-group
        class="${classMap({
          disabled: this._type !== 'text' || !this._multiline,
        })}"
      >
        <vscode-label for="lines">Lines</vscode-label>
        <vscode-inputbox
          value="${this._lines}"
          id="lines"
          name="lines"
          type="number"
          min="1"
          @vsc-input="${this._onLinesChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const maxLinesWidget = html`
      <vscode-form-group
        class="${classMap({
          disabled: this._type !== 'text' || !this._multiline,
        })}"
      >
        <vscode-label for="maxLines">MaxLines</vscode-label>
        <vscode-inputbox
          value="${this._maxLines}"
          id="maxLines"
          name="maxLines"
          type="number"
          min="1"
          @vsc-input="${this._onMaxLinesChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const maxLengthWidget = html`
      <vscode-form-group class="${classMap({disabled: this._type !== 'text'})}">
        <vscode-label for="maxLength">MaxLength</vscode-label>
        <vscode-inputbox
          value="${this._maxLength}"
          id="maxLength"
          name="maxLength"
          type="number"
          min="1"
          @vsc-input="${this._onMaxLengthChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const multipleWidget = html`
      <vscode-form-group class="${classMap({disabled: this._type !== 'enum'})}">
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
      <vscode-form-group class="${classMap({disabled: this._type !== 'enum'})}">
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
          disabled: this._type !== 'enum' || !this._multiple,
        })}"
      >
        <vscode-label for="separator">Separator</vscode-label>
        <vscode-inputbox
          value="${this._separator}"
          id="separator"
          multiline
          name="separator"
          @vsc-input="${this._onSeparatorChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;

    const optionsWidget = html`
      <vscode-form-group
        class="${classMap({
          disabled: this._type !== 'enum',
        })}"
      >
        <vscode-label>
          Options ${this._options.length ? `(${this._options.length})` : ''}
        </vscode-label>
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
          <vscode-icon
            name="x"
            action-icon
            @click="${this._onDeleteClick}"
          ></vscode-icon>
        </div>
      </div>
    `;

    const activeView = html`
      <div>
        <vscode-form-container id="form" responsive>
          ${nameWidget} ${labelWidget} ${valueWidget} ${typeWidget}
          ${descriptionWidget} ${prefixWidget} ${suffixWidget}
          ${multilineWidget} ${monospaceWidget} ${linesWidget} ${maxLinesWidget} ${maxLengthWidget}
          ${multipleWidget} ${separatorWidget} ${comboboxWidget}
          ${optionsWidget}
          ${this._isOptionsWindowVisible ? optionsWindow : nothing}
          <vscode-form-group>
            <vscode-button @click="${this._onSaveClick}">Save</vscode-button>
            <vscode-button secondary @click="${this._onCancelClick}"
              >Cancel</vscode-button
            >
          </vscode-form-group>
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
