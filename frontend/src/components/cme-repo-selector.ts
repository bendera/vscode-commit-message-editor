import {LitElement, html, css, CSSResult, TemplateResult} from 'lit';
import {customElement, state, property} from 'lit/decorators.js';
import {nothing} from 'lit';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-icon';
import '@bendera/vscode-webview-elements/dist/vscode-single-select';
import '@bendera/vscode-webview-elements/dist/vscode-option';
import store, {RootState} from '../store/store';

@customElement('cme-repo-selector')
export class RepoSelector extends connect(store)(LitElement) {
  @property()
  get selectedRepositoryPath(): string {
    return this._selectedRepositoryPath;
  }

  @state()
  private _numberOfRepositories = 1;

  @state()
  private _selectedRepositoryPath = '';

  @state()
  private _availableRepositories: string[] = [];

  stateChanged(state: RootState): void {
    const {
      numberOfRepositories,
      selectedRepositoryPath,
      availableRepositories,
    } = state;

    this._numberOfRepositories = numberOfRepositories;
    this._selectedRepositoryPath = selectedRepositoryPath;
    this._availableRepositories = availableRepositories;
  }

  private _getNameFromPath(fp: string) {
    const fpParts = fp.split('/');
    return fpParts[fpParts.length - 1];
  }

  private _handleChange(
    ev: CustomEvent<{selectedIndex: number; value: string}>
  ) {
    this._selectedRepositoryPath = ev.detail.value;

    const changeEvent = new CustomEvent('cme-change', {
      detail: ev.detail.value,
    });

    this.dispatchEvent(changeEvent);
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

    return html`<div class="repo-info">
      <vscode-icon name="repo"></vscode-icon>&nbsp;
      <b>Selected repository:</b>&nbsp;
      <vscode-single-select @vsc-change=${this._handleChange}>
        ${this._availableRepositories.map(
          (r) =>
            html`<vscode-option
              description=${r}
              value=${r}
              ?selected=${this._selectedRepositoryPath === r}
              >${this._getNameFromPath(r)}</vscode-option
            >`
        )}
      </vscode-single-select>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cme-repo-selector': RepoSelector;
  }
}
