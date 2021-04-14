import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
} from 'lit-element';
import {insertTab, insertNewline} from './helpers';

@customElement('cme-code-editor')
export class CodeEditor extends LitElement {
  private _handleFocus(ev: FocusEvent) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  private _handleKeyDown(ev: KeyboardEvent) {
    const el = ev.composedPath()[0] as HTMLTextAreaElement;

    if (ev.key === 'Tab') {
      insertTab(el);
      ev.preventDefault();
    }

    if (ev.key === 'Enter') {
      insertNewline(el);
      ev.preventDefault();
    }
  }

  static get styles(): CSSResult {
    return css`
      .editor {
        background-color: var(--vscode-editor-background);
        border: 0;
        color: var(--vscode-editor-foreground);
        font-family: var(--vscode-editor-font-family);
        font-size: var(--vscode-editor-font-size);
        height: 200px;
        resize: none;
        tab-size: 2;
        width: 100%;
        white-space: pre;
      }

      .editor:focus {
        outline: none;
      }
    `;
  }

  render(): TemplateResult {
    return html`<div class="wrapper">
      <textarea
        class="editor"
        spellcheck="false"
        @keydown="${this._handleKeyDown}"
      >Aenean interdum ex at fringilla fermentum.
Vestibulum elementum justo ut ex bibendum faucibus.
Suspendisse at ipsum a elit eleifend laoreet vel eget lorem.
Integer volutpat turpis vel diam sollicitudin, et ornare risus tempus.
Duis in ligula sit amet tortor dapibus vulputate.</textarea>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cme-code-editor': CodeEditor;
  }
}
