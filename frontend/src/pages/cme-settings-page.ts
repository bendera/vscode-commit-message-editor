import {LitElement, html, customElement, TemplateResult} from 'lit-element';
import {connect} from 'pwa-helpers';
import store from '../store/store';

@customElement('cme-settings-page')
export class SettingsPage extends connect(store)(LitElement) {
  render(): TemplateResult {
    return html`<p>Settings page</p>`;
  }
}
