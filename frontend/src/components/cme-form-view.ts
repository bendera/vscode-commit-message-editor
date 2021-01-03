import {LitElement, html, css, customElement, CSSResult, TemplateResult} from 'lit-element';

@customElement('cme-form-view')
export class FormView extends LitElement {
  static get styles(): CSSResult {
    return css`
    `;
  }

  render(): TemplateResult {
    return html`
      <div>
        form view
      </div>
    `;
  }
}
