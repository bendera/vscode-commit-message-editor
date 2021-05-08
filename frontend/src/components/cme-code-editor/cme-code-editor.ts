import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
  internalProperty,
  query,
} from 'lit-element';
import {styleMap} from 'lit-html/directives/style-map';
import {CodeEditorHistory} from './CommandHistory';
import {
  insertTab,
  insertNewline,
  getNewlinePosList,
  getCurrentLine,
  getLongestLineLength,
} from './helpers';

const PADDING = 4;
const BORDER_W = 1;
const HISTORY_LENGTH = 50;
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
    this._history.add({type: 'initializing', value: val, caretPos: val.length});
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

  @property({type: Number})
  lines = 10;

  @property({type: Number})
  tabSize = 2;

  @property({type: Boolean})
  useTabs = false;

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

  @query('.wrapper')
  private _wrapperEl!: HTMLDivElement;

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
    }
  }

  private _handleChange(ev: InputEvent) {
    const el = ev.composedPath()[0] as HTMLTextAreaElement;
    this._history.add({
      type: 'inputchange',
      value: el.value,
      caretPos: el.selectionEnd,
    });
    this._linefeedPositions = getNewlinePosList(el.value);
    this._longestLineStrLength = getLongestLineLength(el);
  }

  private _scrollCaretToVisibleArea(ta: HTMLTextAreaElement) {
    const cl = getCurrentLine(ta, getNewlinePosList(ta.value)) + 1;

    if (this._lineHeight * cl < this._wrapperEl.scrollTop) {
      setTimeout(() => {
        this._wrapperEl.scrollTop = this._lineHeight * (cl - 1) + PADDING;
      }, 100);
    } else if (
      this._lineHeight * cl >=
      this._wrapperEl.scrollTop + this.lines * this._lineHeight
    ) {
      setTimeout(() => {
        this._wrapperEl.scrollTop =
          this._lineHeight * cl - this.lines * this._lineHeight;
      }, 1);
    }
  }

  private _handleKeyDown(ev: KeyboardEvent) {
    const el = ev.composedPath()[0] as HTMLTextAreaElement;

    if (ev.key === 'Tab') {
      ev.preventDefault();
      insertTab(el, this.useTabs, this.tabSize);
      this._history.add({
        type: 'keypress',
        value: el.value,
        caretPos: el.selectionEnd,
      });
      this._scrollCaretToVisibleArea(el);
    }

    if (ev.key === 'Enter') {
      ev.preventDefault();
      insertNewline(el);
      this._history.add({
        type: 'keypress',
        value: el.value,
        caretPos: el.selectionEnd,
      });
      this._wrapperEl.scrollLeft = 0;
      this._scrollCaretToVisibleArea(el);
    }

    if (ev.key === 'z' && ev.ctrlKey) {
      ev.preventDefault();
      ev.stopPropagation();
      const prev = this._history.undo();

      if (prev) {
        const {value, caretPos} = prev;

        el.value = value;
        el.selectionStart = el.selectionEnd = caretPos;
      }
    }

    if (ev.key === 'y' && ev.ctrlKey) {
      ev.preventDefault();
      ev.stopPropagation();
      const next = this._history.redo();

      if (next) {
        const {value, caretPos} = next;

        el.value = value;
        el.selectionStart = el.selectionEnd = caretPos;
      }
    }

    this._linefeedPositions = getNewlinePosList(el.value);
    this._longestLineStrLength = getLongestLineLength(el);
  }

  private _handleKeyUp(ev: KeyboardEvent) {
    if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      const el = ev.composedPath()[0] as HTMLTextAreaElement;

      this._linefeedPositions = getNewlinePosList(el.value);
    }
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }

      .wrapper {
        background-color: var(--vscode-editorWidget-background);
        border: 1px solid var(--vscode-editorWidget-border);
        box-sizing: border-box;
        overflow-y: auto;
        padding: 4px;
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
        background-color: var(--vscode-editorWidget-background);
      }

      .editable-area-wrapper {
        cursor: text;
        min-height: 100%;
        min-width: 100%;
        overflow: visible;
        position: relative;
        width: 100%;
        z-index: 2;
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
        display: block;
        font-family: var(--vscode-editor-font-family);
        font-size: var(--vscode-editor-font-size);
        font-weight: var(--vscode-font-weight);
        height: 200px;
        line-height: 1.3;
        min-width: 100%;
        overflow: hidden;
        padding: 0;
        position: relative;
        resize: none;
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
        margin-left: 4px;
        min-height: 100%;
        overflow: hidden;
        pointer-events: none;
        position: absolute;
        top: 0;
        width: calc(100% - 4px);
        z-index: 1;
      }

      .ruler {
        border-right: 1px solid var(--vscode-editorRuler-foreground);
        display: flex;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
      }

      .ruler-placeholder {
        font-family: var(--vscode-editor-font-family);
        font-size: var(--vscode-editor-font-size);
        font-weight: var(--vscode-font-weight);
        white-space: pre;
      }
    `;
  }

  render(): TemplateResult {
    const numLines = this._linefeedPositions.length + 1;
    const textareaHeight = this._lineHeight * numLines;
    const textareaWidth = this._longestLineStrLength * this._charWidth;
    const wrapperStyles = styleMap({
      height: `${this.lines * this._lineHeight + PADDING * 2 + BORDER_W * 2}px`,
    });
    const editableAreaWrapperStyles = styleMap({
      width: `${textareaWidth}px`,
    });
    const textareaStyles = styleMap({
      height: `${textareaHeight}px`,
      lineHeight: `${this._lineHeight}px`,
      tabSize: String(this.tabSize),
    });
    const rulersStyles = styleMap({
      height: `${textareaHeight + PADDING * 2}px`,
    });

    const rulerElements = this.rulers.map(
      (pos) => html`
        <div class="ruler">
          <div class="ruler-placeholder">${''.padStart(pos, ' ')}</div>
        </div>
      `
    );

    return html`<div
      class="wrapper"
      style="${wrapperStyles}"
      @click="${this._handleWrapperClick}"
    >
      <div class="editable-area-wrapper" style="${editableAreaWrapperStyles}">
        <textarea
          id="inputElement"
          class="textarea"
          spellcheck="false"
          @keydown="${this._handleKeyDown}"
          @keyup="${this._handleKeyUp}"
          @input="${this._handleChange}"
          .value="${this._value}"
          style="${textareaStyles}"
        ></textarea>
      </div>
      <div class="rulers" style="${rulersStyles}">${rulerElements}</div>
    </div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cme-code-editor': CodeEditor;
  }
}
