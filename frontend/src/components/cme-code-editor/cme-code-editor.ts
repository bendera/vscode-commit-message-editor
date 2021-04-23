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
import {styleMap} from 'lit-html/directives/style-map';
import {CodeEditorHistory} from './CommandHistory';
import {
  insertTab,
  insertNewline,
  getNewlinePosList,
  getCurrentLine,
} from './helpers';

const VISIBLE_LINES = 10;
const HISTORY_LENGTH = 20;
// Borrowed from VSCode source code:
// See: https://github.com/microsoft/vscode/blob/0e2d23ec434f55031ed8a9c000d7a3a69676f11a/src/vs/editor/common/config/fontInfo.ts#L14
const LINE_HEIGHT_RATIO =
  navigator.userAgent.indexOf('Mac') !== -1 ? 1.5 : 1.35;

@customElement('cme-code-editor')
export class CodeEditor extends LitElement {
  @property()
  set value(val: string) {
    this._value = val;
    this._history.clear();
    this._history.add({type: 'initializing', value: val});
    this._linefeedPositions = getNewlinePosList(val);
  }
  get value(): string {
    const input = this.renderRoot.querySelector(
      '#inputElement'
    ) as HTMLInputElement;

    return input.value;
  }

  @property({type: Array})
  rulers: number[] = [];

  connectedCallback(): void {
    super.connectedCallback();

    const charDimensions = this._measureCharacter();

    this._lineHeight = charDimensions.h;
    this._charWidth = charDimensions.w;
  }

  @internalProperty()
  private _value = '';

  @internalProperty()
  private _linefeedPositions: number[] = [];

  @internalProperty()
  private _currentLine = 0;

  private _history: CodeEditorHistory = new CodeEditorHistory(HISTORY_LENGTH);
  private _lineHeight = 0;
  private _longestLineStrLength = 0;
  private _charWidth = 0;

  private _measureCharacter(): {w: number; h: number} {
    const fontSizeStr = getComputedStyle(document.body).getPropertyValue(
      '--vscode-editor-font-size'
    );
    const fontSize = parseInt(fontSizeStr);
    const lineHeight = Math.round(fontSize * LINE_HEIGHT_RATIO);
    const measureEl = document.createElement('span');

    measureEl.innerHTML = 'M';
    measureEl.style.display = 'inline-block';
    measureEl.style.fontSize = fontSizeStr;
    measureEl.style.fontFamily = getComputedStyle(
      document.body
    ).getPropertyValue('--vscode-editor-font-family');
    measureEl.style.lineHeight = `${lineHeight}px`;

    this.shadowRoot?.appendChild(measureEl);

    const boundRect = measureEl.getBoundingClientRect();

    return {
      w: boundRect.width,
      h: boundRect.height,
    };
  }

  private _handleWrapperClick() {
    const textareaEl = this.shadowRoot?.querySelector(
      '#inputElement'
    ) as HTMLTextAreaElement;

    if (textareaEl) {
      textareaEl.focus();

      this._linefeedPositions = getNewlinePosList(textareaEl.value);
      this._currentLine = getCurrentLine(textareaEl, this._linefeedPositions);
      console.log(this._currentLine);
    }
  }

  private _handleChange(ev: InputEvent) {
    const el = ev.composedPath()[0] as HTMLTextAreaElement;
    this._history.add({type: 'inputchange', value: el.value});
    this._linefeedPositions = getNewlinePosList(el.value);
    this._currentLine = getCurrentLine(el, this._linefeedPositions);
    console.log(this._currentLine);
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

      const wrapper = this.shadowRoot?.querySelector('.wrapper');

      if (wrapper) {
        wrapper.scrollLeft = 0;

        setTimeout(() => {
          wrapper.scrollTop = 99999;
        }, 1);
      }
    }

    if (ev.key === 'z' && ev.ctrlKey) {
      ev.preventDefault();
      const prev = this._history.undo()?.value;

      if (prev) {
        el.value = prev;
      }
    }

    if (ev.key === 'y' && ev.ctrlKey) {
      ev.preventDefault();
      const next = this._history.redo()?.value;

      if (next) {
        el.value = next;
      }
    }

    this._linefeedPositions = getNewlinePosList(el.value);
    this._currentLine = getCurrentLine(el, this._linefeedPositions);
    this._longestLineStrLength = el.value.split('\n').reduce((acc, curr) => {
      if (curr.length > acc) {
        return curr.length;
      }

      return acc;
    }, 0);
  }

  private _handleKeyUp(ev: KeyboardEvent) {
    if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      const el = ev.composedPath()[0] as HTMLTextAreaElement;

      this._linefeedPositions = getNewlinePosList(el.value);
      this._currentLine = getCurrentLine(el, this._linefeedPositions);
    }
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }

      .wrapper {
        background-color: var(--vscode-editor-background);
        border: 1px solid var(--vscode-settings-textInputBorder);
        box-sizing: border-box;
        cursor: text;
        overflow-y: auto;
        position: relative;
      }

      .wrapper::-webkit-scrollbar {
        cursor: default;
        height: 10px;
        width: 10px;
      }

      .wrapper::-webkit-scrollbar-thumb {
        background-color: var(--vscode-scrollbarSlider-background);
      }

      .wrapper::-webkit-scrollbar-corner {
        background-color: var(--vscode-editor-background);
      }

      .editor {
        display: flex;
        height: 100%;
        min-width: 100%;
        position: relative;
        z-index: 2;
      }

      .line-numbers {
        color: var(--vscode-editorLineNumber-foreground);
        font-family: var(--vscode-editor-font-family);
        font-size: var(--vscode-editor-font-size);
        left: 0;
        position: sticky;
        user-select: none;
        z-index: 2;
      }

      .line-numbers div {
        background-color: var(--vscode-editor-background);
        min-width: 27px;
        padding-left: 10px;
        padding-right: 10px;
        text-align: right;
      }

      .editable-area-wrapper {
        overflow: visible;
        position: relative;
        width: 100%;
      }

      .textarea-scroller {
        height: 100%;
        min-width: 100%;
      }

      .textarea {
        background-color: transparent;
        border: 0;
        box-sizing: border-box;
        color: var(--vscode-editorWidget-foreground);
        font-family: var(--vscode-editor-font-family);
        font-size: var(--vscode-editor-font-size);
        font-weight: var(--vscode-font-weight);
        height: 200px;
        line-height: 1.3;
        overflow: hidden;
        padding: 0;
        position: relative;
        resize: none;
        tab-size: 2;
        width: 100%;
        white-space: pre;
        z-index: 1;
      }

      .textarea::selection {
        background-color: var(--vscode-editor-selectionBackground);
      }

      .textarea:focus {
        outline: none;
      }

      .rulers {
        display: block;
        left: 0;
        margin-left: 47px;
        min-height: 100%;
        overflow: hidden;
        pointer-events: none;
        position: absolute;
        top: 0;
        width: calc(100% - 47px);
      }

      .ruler {
        border-right: 1px solid var(--vscode-editorRuler-foreground);
        display: flex;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
      }

      .placeholder {
        font-family: var(--vscode-editor-font-family);
        font-size: var(--vscode-editor-font-size);
        font-weight: var(--vscode-font-weight);
        white-space: pre;
      }

      .current-line {
        background-color: var(--vscode-editor-lineHighlightBackground);
        border-bottom: 2px solid var(--vscode-editor-lineHighlightBorder);
        border-top: 2px solid var(--vscode-editor-lineHighlightBorder);
        box-sizing: border-box;
        font-family: var(--vscode-editor-font-family);
        font-size: var(--vscode-editor-font-size);
        font-weight: var(--vscode-font-weight);
        position: absolute;
        white-space: pre;
        width: 100%;
      }
    `;
  }

  render(): TemplateResult {
    const numLines = this._linefeedPositions.length + 1;
    const textareaHeight = this._lineHeight * numLines;
    const textareaWidth = this._longestLineStrLength * this._charWidth;

    const rulerElements = this.rulers.map(
      (pos) => html`
        <div class="ruler">
          <div class="placeholder">${''.padStart(pos, ' ')}</div>
        </div>
      `
    );

    const lineNumbers: TemplateResult[] = [];

    for (let i = 1; i <= numLines; i++) {
      lineNumbers.push(html`<div>${i}</div>`);
    }

    const currentLineStyles = styleMap({
      height: `${this._lineHeight}px`,
      top: `${this._currentLine * this._lineHeight}px`,
    });

    return html`<div
      class="wrapper"
      style="${styleMap({height: `${this._lineHeight * VISIBLE_LINES}px`})}"
      @click="${this._handleWrapperClick}"
    >
      <div
        class="editor"
        style="${styleMap({
          width: `${textareaWidth}px`,
        })}"
      >
        <div
          class="line-numbers"
          style="${styleMap({lineHeight: `${this._lineHeight}px`})}"
        >
          ${lineNumbers}
        </div>
        <div class="editable-area-wrapper">
          <div
            class="textarea-scroller"
            style="${styleMap({
              width: `${textareaWidth}px`,
            })}"
          >
            <textarea
              id="inputElement"
              class="textarea"
              spellcheck="false"
              @keydown="${this._handleKeyDown}"
              @keyup="${this._handleKeyUp}"
              @input="${this._handleChange}"
              .value="${this._value}"
              style="${styleMap({
                height: `${textareaHeight}px`,
                lineHeight: `${this._lineHeight}px`,
              })}"
            ></textarea>
            <div
              class="rulers"
              style="${styleMap({
                height: `${textareaHeight}px`,
              })}"
            >
              ${rulerElements}
            </div>
          </div>
        </div>
        <div class="current-line" style=${currentLineStyles}>&nbsp;</div>
      </div>
    </div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cme-code-editor': CodeEditor;
  }
}
