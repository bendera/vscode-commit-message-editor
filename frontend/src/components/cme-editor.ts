import {LitElement, html, css, customElement, CSSResult} from 'lit-element';
import '@bendera/vscode-webview-elements/dist/vscode-checkbox';
import '@bendera/vscode-webview-elements/dist/vscode-icon';

@customElement('cme-editor')
export class CMEEditor extends LitElement {
  static get styles(): CSSResult {
    return css`
    `;
  }

  render() {
    return html`
      <div>
        <vscode-icon name="bug"></vscode-icon>
        <vscode-checkbox label="Lorem Ipsum"></vscode-checkbox>
      </div>
    `;
  }
}
