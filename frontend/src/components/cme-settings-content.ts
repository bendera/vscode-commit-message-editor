import {LitElement, html, TemplateResult, CSSResult, css, nothing} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-button';
import '@bendera/vscode-webview-elements/dist/vscode-form-helper';
import {debounce} from 'ts-debounce';
import store, {RootState} from '../store/store';
import {getAPI} from '../utils/VSCodeAPIService';
import './cme-token-item-edit/cme-token-item-edit';
import {
  shareableConfigTokenChange,
  shareableConfigTokenDelete,
  shareableConfigTokenAdd,
  staticTemplateChange,
  dynamicTemplateChange,
  changeStatusMessage,
} from '../store/actions';

const vscode = getAPI();

enum ConfigurationTarget {
  Global = 1,
  Workspace = 2,
  workspaceFolder = 3,
}

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
  private _statusMessage = '';

  @state()
  private _statusMessageType: 'error' | 'success' | 'invisible' = 'invisible';

  private _configurationTarget: ConfigurationTarget =
    ConfigurationTarget.Global;

  stateChanged(state: RootState): void {
    const {statusMessage, statusMessageType} = state;
    const {staticTemplate, dynamicTemplate, tokens} = state.shareableConfig;

    this._staticTemplate = staticTemplate;
    this._dynamicTemplate = dynamicTemplate;
    this._tokens = tokens;
    this._statusMessage = statusMessage;
    this._statusMessageType = statusMessageType;
  }

  connectedCallback(): void {
    super.connectedCallback();

    vscode.postMessage({
      command: 'loadCurrentConfig',
    });
  }

  private _onErrorCloseClick() {
    store.dispatch(
      changeStatusMessage({
        statusMessage: '',
        statusMessageType: 'invisible',
      })
    );
  }

  private _onImportButtonClick() {
    vscode.postMessage({
      command: 'importConfig',
    });
  }

  private _onExportButtonClick() {
    vscode.postMessage({
      command: 'exportConfig',
      payload: {
        staticTemplate: this._staticTemplate,
        dynamicTemplate: this._dynamicTemplate,
        tokens: this._tokens,
      },
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

  private _onConfigTargetSelectChange(ev: CustomEvent) {
    this._configurationTarget = Number(ev.detail.value);
  }

  private _onSaveSettingsClick() {
    vscode.postMessage({
      command: 'saveToSettings',
      payload: {
        configurationTarget: this._configurationTarget,
        configuration: {
          staticTemplate: this._staticTemplate,
          dynamicTemplate: this._dynamicTemplate,
          tokens: this._tokens,
        },
      },
    });
  }

  private _onStaticTplChange(ev: CustomEvent) {
    store.dispatch(staticTemplateChange(ev.detail));
  }

  private _onDynamicTplChange(ev: CustomEvent) {
    store.dispatch(dynamicTemplateChange(ev.detail));
  }

  private _onStaticTplChangeDebounced = debounce(this._onStaticTplChange, 400);

  private _onDynamicTplChangeDebounced = debounce(
    this._onDynamicTplChange,
    400
  );

  static get styles(): CSSResult {
    return css`
      h1 {
        font-family: var(--vscode-font-family);
        font-size: 24px;
        font-weight: 600;
        padding-left: 14px;
        padding-right: 14px;
      }

      .settings-content {
        margin: 0 auto;
        max-width: 727px;
        padding-top: 15px;
      }

      .header-toolbar {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10px;
        margin-left: 14px;
        margin-right: 14px;
        position: relative;
      }

      .import-export {
        display: flex;
        margin-bottom: 5px;
        margin-top: 5px;
        max-width: 727px;
      }

      .import-export vscode-button {
        display: block;
        margin-right: 4px;
      }

      .persist {
        align-items: center;
        display: flex;
        justify-content: center;
        margin-bottom: 5px;
        margin-left: auto;
        margin-top: 5px;
      }

      .persist vscode-label {
        margin-right: 4px;
      }

      .persist vscode-single-select {
        margin-right: 4px;
        width: 140px;
      }

      .error {
        align-items: center;
        background-color: var(--vscode-inputValidation-errorBackground);
        border: 1px solid var(--vscode-inputValidation-errorBorder);
        box-sizing: border-box;
        display: flex;
        margin-top: 10px;
        max-width: 699px;
        min-height: 30px;
        padding: 3px 6px;
        position: relative;
        width: 100%;
      }

      .error vscode-icon[name='x'] {
        position: absolute;
        right: 3px;
      }

      .template-inputbox {
        box-sizing: border-box;
        display: block;
        width: 100%;
      }

      .tokens {
        padding: 18px 14px;
        max-width: 727px;
      }

      .tokens-list {
        margin-bottom: 10px;
      }

      cme-token-item-edit {
        margin: 0 auto;
        max-width: 727px;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="settings-content">
        <h1>Portable configuration editor</h1>
        <div class="header-toolbar">
          <div class="import-export">
            <vscode-button
              @click="${this._onImportButtonClick}"
              icon="folder-opened"
              >Import</vscode-button
            >
            <vscode-button @click="${this._onExportButtonClick}" icon="save"
              >Export</vscode-button
            >
          </div>
          <div class="persist">
            <vscode-label for="context">Save settings to:</vscode-label>
            <vscode-single-select
              id="context"
              @vsc-change="${this._onConfigTargetSelectChange}"
            >
              <vscode-option value="${ConfigurationTarget.Global}"
                >User</vscode-option
              >
              <vscode-option value="${ConfigurationTarget.Workspace}"
                >Workspace</vscode-option
              >
              <vscode-option value="${ConfigurationTarget.workspaceFolder}"
                >Workspace folder</vscode-option
              >
            </vscode-single-select>
            <vscode-button @click="${this._onSaveSettingsClick}"
              >Save</vscode-button
            >
          </div>
          ${this._statusMessageType !== 'invisible'
            ? html`<div
                class="${classMap({
                  status: true,
                  [this._statusMessageType]: true,
                })}"
              >
                ${this._statusMessage}
                <vscode-icon
                  name="x"
                  action-icon
                  @click="${this._onErrorCloseClick}"
                ></vscode-icon>
              </div>`
            : html`${nothing}`}
        </div>

        <vscode-form-group variant="settings-group">
          <vscode-label for="staticTemplate">Static template</vscode-label>
          <vscode-form-helper>Template for the text view</vscode-form-helper>
          <vscode-inputbox
            id="staticTemplate"
            name="staticTemplate"
            lines="5"
            multiline
            value="${this._staticTemplate.join('\n')}"
            class="template-inputbox"
            @vsc-input="${this._onStaticTplChangeDebounced}"
          ></vscode-inputbox>
        </vscode-form-group>

        <vscode-form-group variant="settings-group">
          <vscode-label for="dynamicTemplate">Dynamic template</vscode-label>
          <vscode-form-helper>Template for the form view</vscode-form-helper>
          <vscode-inputbox
            id="dynamicTemplate"
            name="dynamicTemplate"
            lines="5"
            multiline
            value="${this._dynamicTemplate.join('\n')}"
            class="template-inputbox"
            @vsc-input="${this._onDynamicTplChangeDebounced}"
          ></vscode-inputbox>
        </vscode-form-group>

        <div class="tokens">
          <vscode-label>Tokens</vscode-label>
          <div class="tokens-list">
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
          </div>
          <vscode-button @click="${this._onAddItemClick}"
            >Add item</vscode-button
          >
        </div>
      </div>
    `;
  }
}
