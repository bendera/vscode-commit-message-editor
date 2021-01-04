import {LitElement, html, customElement, TemplateResult} from 'lit-element';
import {connect} from 'pwa-helpers';
import {getAPI} from '../utils/VSCodeAPIService';
import store from '../store/store';
import '../components/cme-editor';
import {copyFromSCMInputBox, receiveConfig} from '../store/actions';

const vscode = getAPI();

@customElement('cme-editor-page')
export class EditorPage extends connect(store)(LitElement) {
  connectedCallback(): void {
    super.connectedCallback();

    window.addEventListener('message', this._handlePostMessages.bind(this));

    vscode.postMessage({
      command: 'requestConfig',
    });
  }

  render(): TemplateResult {
    return html` <cme-editor></cme-editor> `;
  }

  private _handlePostMessages(ev: MessageEvent<ReceivedMessageDO>) {
    const {command, payload} = ev.data;

    switch (command) {
      case 'receiveConfig':
        store.dispatch(receiveConfig(payload as ExtensionConfig));
        break;
      case 'copyFromSCMInputBox':
        store.dispatch(copyFromSCMInputBox(payload as string));
        break;
    }
  }
}
