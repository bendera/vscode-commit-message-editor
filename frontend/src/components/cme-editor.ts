import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
} from 'lit-element';
import '@bendera/vscode-webview-elements/dist/vscode-tabs';
import './cme-text-view';
import './cme-form-view';

@customElement('cme-editor')
export class Editor extends LitElement {
  static get styles(): CSSResult {
    return css`
      vscode-tabs {
        margin: 0 auto 30px;
        max-width: 763px;
        width: 100%;
      }
    `;
  }

  render(): TemplateResult {
    // TODO: set selectedIndex dynamically
    return html`
      <vscode-tabs selectedIndex="0">
        <header slot="header">Edit as text</header>
        <section>
          <cme-text-view></cme-text-view>
        </section>
        <header slot="header">Edit as form</header>
        <section>
          <cme-form-view></cme-form-view>
        </section>
      </vscode-tabs>
    `;
  }
}
