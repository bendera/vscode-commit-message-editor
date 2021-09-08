import {LitElement, html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-button';
import store, {StatusMessageType} from '../store/store';
import '../components/cme-settings-content';
import {changeStatusMessage, shareableConfigChange} from '../store/actions';

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
        store.dispatch(shareableConfigChange(payload as ShareableConfig));
        break;
      case 'statusMessage':
        {
          store.dispatch(
            changeStatusMessage(
              payload as {
                statusMessage: string;
                statusMessageType: StatusMessageType;
              }
            )
          );
        }

        break;
      case 'loadCurrentConfig':
        store.dispatch(shareableConfigChange(payload as ShareableConfig));
        break;
      default:
    }
  }

  private _handlePostMessagesBound = this._handlePostMessages.bind(this);

  render(): TemplateResult {
    return html` <cme-settings-content></cme-settings-content> `;
  }
}
