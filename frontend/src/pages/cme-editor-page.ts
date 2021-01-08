import {LitElement, html, customElement, TemplateResult} from 'lit-element';
import {connect} from 'pwa-helpers';
import {getAPI} from '../utils/VSCodeAPIService';
import store, {RootState} from '../store/store';
import '../components/cme-editor';
import {
  closeTab,
  copyFromSCMInputBox,
  receiveConfig,
  recentCommitsReceived,
  replaceState,
} from '../store/actions';

const vscode = getAPI();

@customElement('cme-editor-page')
export class EditorPage extends connect(store)(LitElement) {
  constructor() {
    super();

    const initialState = vscode.getState();

    if (initialState) {
      store.dispatch(replaceState(initialState as RootState));
    } else {
      vscode.postMessage({
        command: 'requestConfig',
      });
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('message', this._handlePostMessages.bind(this));
  }

  render(): TemplateResult {
    return html` <cme-editor></cme-editor> `;
  }

  private _handlePostMessages(ev: MessageEvent<ReceivedMessageDO>) {
    const {command, payload} = ev.data;
    const state = store.getState();
    const {saveAndClose} = state.config.view;

    switch (command) {
      case 'amendPerformed':
        if(saveAndClose) {
          store.dispatch(closeTab());
        }
        break;
      case 'receiveConfig':
        store.dispatch(receiveConfig(payload as ExtensionConfig));
        break;
      case 'recentCommitMessages':
        store.dispatch(recentCommitsReceived(payload as Commit[]));
        break;
      case 'copyFromSCMInputBox':
        store.dispatch(copyFromSCMInputBox(payload as string));
        break;
    }
  }
}
