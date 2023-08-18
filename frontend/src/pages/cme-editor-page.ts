import {LitElement, html, css, TemplateResult, CSSResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import {connect} from 'pwa-helpers';
import {getAPI} from '../utils/VSCodeAPIService';
import store from '../store/store';
import '../components/cme-editor';
import {
  closeTab,
  copyFromSCMInputBox,
  receiveConfig,
  receiveRepositoryInfo,
  recentCommitsReceived,
} from '../store/actions';
import {
  Commit,
  ExtensionConfig,
  ReceivedMessageDO,
  RepositoryInfo,
} from '../definitions';

const vscode = getAPI();

@customElement('cme-editor-page')
export class EditorPage extends connect(store)(LitElement) {
  constructor() {
    super();

    vscode.postMessage({
      command: 'requestConfig',
    });
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('message', this._handlePostMessagesBound);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('message', this._handlePostMessagesBound);
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }
    `;
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
        if (saveAndClose) {
          store.dispatch(closeTab());
        }
        break;
      case 'receiveConfig':
        store.dispatch(receiveConfig(payload as ExtensionConfig));
        break;
      case 'repositoryInfo':
        store.dispatch(receiveRepositoryInfo(payload as RepositoryInfo));
        break;
      case 'recentCommitMessages':
        store.dispatch(recentCommitsReceived(payload as Commit[]));
        break;
      case 'copyFromSCMInputBox':
        store.dispatch(copyFromSCMInputBox(payload as string));
        break;
    }
  }

  private _handlePostMessagesBound = this._handlePostMessages.bind(this);
}
