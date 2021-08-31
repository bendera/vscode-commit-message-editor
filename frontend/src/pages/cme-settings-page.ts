import {LitElement, html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-button';
import store from '../store/store';
import '../components/cme-settings-content';
import {shareableConfigChange} from '../store/actions';

@customElement('cme-settings-page')
export class SettingsPage extends connect(store)(LitElement) {
  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('message', this._handlePostMessagesBound);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('message', this._handlePostMessagesBound);
  }

  private _handlePostMessages(ev: MessageEvent<ReceivedMessageDO>) {
    const {command, payload} = ev.data;

    switch (command) {
      case 'receiveImportedConfig':
        console.log('receive imported config');
        console.log(payload);
        store.dispatch(shareableConfigChange(payload as ShareableConfig));
        break;
      case 'importedConfigError':
        console.log('importedConfigError');
        console.log(payload);
        break;
      default:
    }
  }

  private _handlePostMessagesBound = this._handlePostMessages.bind(this);

  render(): TemplateResult {
    return html` <cme-settings-content></cme-settings-content> `;
  }
}
