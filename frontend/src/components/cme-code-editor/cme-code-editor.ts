import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
  internalProperty,
} from 'lit-element';
import {CodeEditorHistory} from './CommandHistory';
import {insertTab, insertNewline} from './helpers';

const HISTORY_LENGTH = 10;

@customElement('cme-code-editor')
export class CodeEditor extends LitElement {
  private _history: CodeEditorHistory = new CodeEditorHistory(HISTORY_LENGTH);

  @property()
  set value(val: string) {
    this._value = val;
    this._history.clear();
    this._history.add({type: 'initializing', value: val});
  }
  get value(): string {
    const input = this.renderRoot.querySelector(
      '#inputElement'
    ) as HTMLInputElement;

    return input.value;
  }

  @internalProperty()
  private _value = '';

  private _handleChange(ev: InputEvent) {
    const el = ev.composedPath()[0] as HTMLInputElement;
    this._history.add({type: 'inputchange', value: el.value});
    console.log(this._history);
  }

  private _handleKeyDown(ev: KeyboardEvent) {
    const el = ev.composedPath()[0] as HTMLTextAreaElement;

    if (ev.key === 'Tab') {
      ev.preventDefault();
      insertTab(el);
      this._history.add({type: 'keypress', value: el.value});
    }

    if (ev.key === 'Enter') {
      ev.preventDefault();
      insertNewline(el);
      this._history.add({type: 'keypress', value: el.value});
    }

    if (ev.key === 'z' && ev.ctrlKey) {
      ev.preventDefault();
      const prev = this._history.prev()?.value;
      console.log(prev)

      if (prev) {
        el.value = prev;
      }
    }
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }

      .wrapper {
        box-sizing: border-box;
        border: 1px solid var(--vscode-settings-textInputBorder);
      }

      .editor {
        background-color: var(--vscode-editor-background);
        border: 0;
        box-sizing: border-box;
        color: var(--vscode-editor-foreground);
        font-family: var(--vscode-editor-font-family);
        font-size: var(--vscode-editor-font-size);
        font-weight: var(--vscode-font-weight);
        height: 200px;
        resize: none;
        tab-size: 2;
        width: 100%;
        white-space: pre;
      }

      .editor::selection {
        background-color: var(--vscode-editor-selectionBackground);
      }

      .editor:focus {
        outline: none;
      }
    `;
  }

  render(): TemplateResult {
    return html`<div class="wrapper">
      <textarea
        id="inputElement"
        class="editor"
        spellcheck="false"
        @keydown="${this._handleKeyDown}"
        @input="${this._handleChange}"
        .value="${this._value}"
      ></textarea>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cme-code-editor': CodeEditor;
  }
}
