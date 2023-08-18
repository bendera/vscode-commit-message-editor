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
  AMEND_PERFORMED,
  COPY_FROM_SCM_INPUTBOX,
  FrontendPostMessage,
  RECEIVE_CONFIG,
  RECENT_COMMIT_MESSAGES,
  REPOSITORY_INFO,
} from '../shared';

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

  private _handlePostMessages(ev: MessageEvent<FrontendPostMessage>) {
    const state = store.getState();
    const {saveAndClose} = state.config.view;

    switch (ev.data.command) {
      case AMEND_PERFORMED:
        if (saveAndClose) {
          store.dispatch(closeTab());
        }
        break;
      case RECEIVE_CONFIG:
        store.dispatch(receiveConfig(ev.data.payload));
        break;
      case REPOSITORY_INFO:
        store.dispatch(receiveRepositoryInfo(ev.data.payload));
        break;
      case RECENT_COMMIT_MESSAGES:
        store.dispatch(recentCommitsReceived(ev.data.payload));
        break;
      case COPY_FROM_SCM_INPUTBOX:
        store.dispatch(copyFromSCMInputBox(ev.data.payload));
        break;
      default:
    }
  }

  private _handlePostMessagesBound = this._handlePostMessages.bind(this);
}
