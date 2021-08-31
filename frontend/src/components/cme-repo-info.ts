import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  state,
} from 'lit-element';
import {nothing} from 'lit-html';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-icon';
import store, {RootState} from '../store/store';

@customElement('cme-repo-info')
export class RepoInfo extends connect(store)(LitElement) {
  @state()
  private _numberOfRepositories = 1;

  @state()
  private _selectedRepositoryPath = '';

  stateChanged(state: RootState): void {
    const {numberOfRepositories, selectedRepositoryPath} = state;

    this._numberOfRepositories = numberOfRepositories;
    this._selectedRepositoryPath = selectedRepositoryPath;
  }

  static get styles(): CSSResult {
    return css`
      .repo-info {
        align-items: center;
        color: var(--vscode-input-foreground);
        display: flex;
        font-size: var(--vscode-font-size);
        margin: 10px 0;
      }
    `;
  }

  render(): TemplateResult {
    if (this._numberOfRepositories < 2) {
      return html`${nothing}`;
    }

    const fpParts = this._selectedRepositoryPath.split('/');
    const name = fpParts[fpParts.length - 1];

    return html`<div class="repo-info" title="${this._selectedRepositoryPath}">
      <vscode-icon name="repo"></vscode-icon>&nbsp;
      <b>Selected repository:</b>&nbsp; ${name}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cme-repo-info': RepoInfo;
  }
}
