import {LitElement, html, TemplateResult, CSSResult, css, nothing} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-button';
import store, {RootState} from '../store/store';
import {getAPI} from '../utils/VSCodeAPIService';
import './cme-token-item-edit/cme-token-item-edit';
import {
  shareableConfigTokenChange,
  shareableConfigTokenDelete,
  shareableConfigTokenAdd,
} from '../store/actions';

const vscode = getAPI();

@customElement('cme-settings-content')
export class SettingsContent extends connect(store)(LitElement) {
  @state()
  _shareableConfig: ShareableConfig = {
    staticTemplate: [],
    dynamicTemplate: [],
    tokens: [],
  };

  @state()
  private _staticTemplate: string[] = [];

  @state()
  private _dynamicTemplate: string[] = [];

  @state()
  private _tokens: Token[] = [];

  @state()
  private _importError = false;

  @state()
  private _importErrorMessage = '';

  stateChanged(state: RootState): void {
    const {importError, importErrorMessage} = state;
    const {staticTemplate, dynamicTemplate, tokens} = state.shareableConfig;

    this._staticTemplate = staticTemplate;
    this._dynamicTemplate = dynamicTemplate;
    this._tokens = tokens;
    this._importError = importError;
    this._importErrorMessage = importErrorMessage;
  }

  private _onImportButtonClick() {
    vscode.postMessage({
      command: 'importConfig',
    });
  }

  private _onTokenSave(ev: CustomEvent) {
    const {index, data} = ev.detail;

    store.dispatch(shareableConfigTokenChange({index, data}));
  }

  private _onTokenDelete(ev: CustomEvent) {
    const {index} = ev.detail;

    store.dispatch(shareableConfigTokenDelete({index}));
  }

  private _onAddItemClick() {
    store.dispatch(
      shareableConfigTokenAdd({
        name: 'untitled',
        label: 'Untitled',
        type: 'text',
      })
    );
  }

  static get styles(): CSSResult {
    return css`
      .settings-content {
        margin: 0 auto;
        width: 755px;
      }

      .error {
        background-color: var(--vscode-inputValidation-errorBackground);
        border: 1px solid var(--vscode-inputValidation-errorBorder);
        padding: 3px 6px;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="settings-content">
        <p>
          <vscode-button
            @click="${this._onImportButtonClick}"
            icon="folder-opened"
            >Open</vscode-button
          >
          <vscode-button icon="save">Save</vscode-button>
          ${this._importError
            ? html`<div class="error">${this._importErrorMessage}</div>`
            : html`${nothing}`}
        </p>

        <vscode-form-group variant="settings-group">
          <vscode-label for="staticTemplate">Static template</vscode-label>
          <vscode-inputbox
            id="staticTemplate"
            name="staticTemplate"
            lines="5"
            multiline
            value="${this._staticTemplate.join('\n')}"
          ></vscode-inputbox>
        </vscode-form-group>

        <vscode-form-group variant="settings-group">
          <vscode-label for="dynamicTemplate">Dynamic template</vscode-label>
          <vscode-inputbox
            id="dynamicTemplate"
            name="dynamicTemplate"
            lines="5"
            multiline
            value="${this._dynamicTemplate.join('\n')}"
          ></vscode-inputbox>
        </vscode-form-group>

        ${this._tokens.map(
          (t, i) =>
            html`
              <cme-token-item-edit
                data-index="${i}"
                .token="${t}"
                slot="body"
                @save="${this._onTokenSave}"
                @delete="${this._onTokenDelete}"
              ></cme-token-item-edit>
            `
        )}

        <vscode-button @click="${this._onAddItemClick}">Add item</vscode-button>
      </div>
    `;
  }
}
