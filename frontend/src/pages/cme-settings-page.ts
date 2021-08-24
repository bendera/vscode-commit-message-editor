import {LitElement, html, customElement, TemplateResult} from 'lit-element';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-button';
import store from '../store/store';
import {getAPI} from '../utils/VSCodeAPIService';

const vscode = getAPI();

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
        break;
      case 'importedConfigError':
        console.log('importedConfigError');
        console.log(payload);
        break;
      default:
    }
  }

  private _handlePostMessagesBound = this._handlePostMessages.bind(this);

  private _onImportButtonClick() {
    vscode.postMessage({
      command: 'importConfig',
    });
  }

  render(): TemplateResult {
    return html`
      <div>
        <p>Settings page</p>
        <p>
          <vscode-button @click="${this._onImportButtonClick}">
            Import
          </vscode-button>
        </p>
      </div>
    `;
  }
}
