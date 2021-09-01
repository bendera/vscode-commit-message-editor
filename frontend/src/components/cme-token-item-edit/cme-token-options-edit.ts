import {css, CSSResult, html, LitElement, TemplateResult} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import '@bendera/vscode-webview-elements/dist/vscode-button';
import '@bendera/vscode-webview-elements/dist/vscode-form-group';
import '@bendera/vscode-webview-elements/dist/vscode-icon';
import '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import '@bendera/vscode-webview-elements/dist/vscode-label';
import '@bendera/vscode-webview-elements/dist/vscode-scrollable';
import {VscodeScrollable} from '@bendera/vscode-webview-elements/dist/vscode-scrollable';
import {VscodeIcon} from '@bendera/vscode-webview-elements/dist/vscode-icon';
import {VscodeInputbox} from '@bendera/vscode-webview-elements/dist/vscode-inputbox';

interface InternalEnumTokenOption extends EnumTokenOption {
  markedForDeletion?: boolean;
}

@customElement('cme-token-options-edit')
export class TokenOptionsEdit extends LitElement {
  @property({type: Array})
  set options(val: EnumTokenOption[]) {
    this._options = [...val];
  }
  get options(): EnumTokenOption[] {
    return this._options
      .filter((o) => !o.markedForDeletion)
      .map(({label, value, description}) => ({label, value, description}));
  }

  @state()
  private _options: InternalEnumTokenOption[] = [];

  @query('#scrollable')
  private _scrollableElement!: VscodeScrollable;

  private _close() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  private _save() {
    this.dispatchEvent(
      new CustomEvent('save', {
        detail: this.options,
      })
    );
    this._close();
  }

  private _remove(ev: MouseEvent) {
    this._toggleMarkedForDeletion(ev, true);
  }

  private _undo(ev: MouseEvent) {
    this._toggleMarkedForDeletion(ev, false);
  }

  private _toggleMarkedForDeletion(ev: MouseEvent, deletionFlag: boolean) {
    const bt = ev.currentTarget as VscodeIcon;
    const index = Number(bt.dataset.index);

    this._options = this._options.map((o, i) =>
      i === index ? {...o, markedForDeletion: deletionFlag} : o
    );
  }

  private async _addOption() {
    this._options = [...this._options, {label: '', value: '', description: ''}];

    await this.updateComplete;

    this._scrollableElement.scrollTop = this._scrollableElement.scrollHeight;
  }

  private _onInputChange(ev: CustomEvent) {
    const el = ev.currentTarget as VscodeInputbox;
    const {index, name} = el.dataset;

    this._options = this._options.map((o, i) => {
      const {label, value, description, markedForDeletion} = o;

      if (i === Number(index)) {
        return {
          label: name === 'label' ? ev.detail : label,
          value: name === 'value' ? ev.detail : value,
          description: name === 'description' ? ev.detail : description,
          markedForDeletion,
        };
      }

      return o;
    });
  }

  static get styles(): CSSResult {
    return css`
      :host {
        position: relative;
      }

      .modal-background {
        background-color: rgba(0, 0, 0, 0.3);
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
      }

      .modal-window {
        background-color: var(--vscode-editor-background);
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.16);
        inset: 20px 150px;
        position: absolute;
      }

      .modal-window .scrollable {
        inset: 0 0 46px;
        overflow: auto;
        position: absolute;
      }

      .fieldset {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 20px 0;
        position: relative;
      }

      .fieldset:nth-child(odd) {
        background-color: rgba(130, 130, 130, 0.04);
      }

      .fieldset:not(:last-child) {
        border-bottom: 1px solid var(--vscode-editorGroup-border);
      }

      vscode-icon[name='trash'] {
        position: absolute;
        right: 10px;
        top: 10px;
      }

      vscode-form-group {
        margin: 0 auto 10px;
        width: 320px;
      }

      vscode-form-group:last-child {
        margin-bottom: 0;
      }

      vscode-label {
        width: 90px;
      }

      .modal-window-footer {
        background-color: var(--vscode-editor-background);
        bottom: 0;
        display: flex;
        height: 26px;
        left: 0;
        padding: 10px;
        position: absolute;
        right: 0;
      }

      .modal-window-footer .ok {
        margin-right: 4px;
      }

      .modal-window-footer .add-option {
        margin-right: auto;
      }
    `;
  }

  private _renderRemoveButton(index: number) {
    return html`
      <vscode-icon
        name="trash"
        action-icon
        title="remove"
        data-index="${index}"
        @click="${this._remove}"
      ></vscode-icon>
    `;
  }

  private _renderUndoButton(index: number) {
    return html`
      <vscode-button data-index="${index}" @click="${this._undo}"
        >Undo</vscode-button
      >
    `;
  }

  private _renderFields({
    label,
    value,
    description,
    index,
  }: {
    label: string;
    value: string;
    description: string;
    index: number;
  }) {
    return html`
      <vscode-form-group variant="vertical">
        <vscode-label for="label-${index}">Label:</vscode-label>
        <vscode-inputbox
          id="label-${index}"
          value="${label}"
          data-index="${index}"
          data-name="label"
          @vsc-input="${this._onInputChange}"
        ></vscode-inputbox>
      </vscode-form-group>
      <vscode-form-group variant="vertical">
        <vscode-label for="value-${index}">Value:</vscode-label>
        <vscode-inputbox
          id="value-${index}"
          value="${ifDefined(value)}"
          data-index="${index}"
          data-name="value"
          @vsc-input="${this._onInputChange}"
        ></vscode-inputbox>
      </vscode-form-group>
      <vscode-form-group variant="vertical">
        <vscode-label for="description-${index}">Description:</vscode-label>
        <vscode-inputbox
          id="description-${index}"
          value="${ifDefined(description)}"
          multiline
          lines="5"
          data-index="${index}"
          data-name="description"
          @vsc-input="${this._onInputChange}"
        ></vscode-inputbox>
      </vscode-form-group>
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="modal-background">
        <div class="modal-window">
          <div class="scrollable" id="scrollable">
            ${this._options.map(
              (
                {label, value, description, markedForDeletion = false},
                index
              ) => html`
                <div class="fieldset">
                  ${!markedForDeletion
                    ? [
                        this._renderRemoveButton(index),
                        this._renderFields({
                          label,
                          value: value || '',
                          description: description || '',
                          index,
                        }),
                      ]
                    : this._renderUndoButton(index)}
                </div>
              `
            )}
          </div>
          <div class="modal-window-footer">
            <vscode-button class="add-option" @click="${this._addOption}"
              >Add option</vscode-button
            >
            <vscode-button class="ok" @click="${this._save}">OK</vscode-button>
            <vscode-button secondary @click="${this._close}"
              >Cancel</vscode-button
            >
          </div>
        </div>
      </div>
    `;
  }
}
