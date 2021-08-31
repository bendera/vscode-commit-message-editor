import {
  LitElement,
  html,
  customElement,
  TemplateResult,
  state,
  CSSResult,
  css,
} from 'lit-element';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-button';
import '@bendera/vscode-webview-elements/dist/vscode-collapsible';
import store, {RootState} from '../store/store';
import {getAPI} from '../utils/VSCodeAPIService';
import './cme-token-item-edit/cme-token-item-edit';

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

  stateChanged(state: RootState): void {
    const {staticTemplate, dynamicTemplate, tokens} = state.shareableConfig;

    this._staticTemplate = staticTemplate;
    this._dynamicTemplate = dynamicTemplate;
    this._tokens = tokens;
  }

  private _onImportButtonClick() {
    vscode.postMessage({
      command: 'importConfig',
    });
  }

  static get styles(): CSSResult {
    return css`
      .settings-content {
        margin: 0 auto;
        width: 755px;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="settings-content">
        <p>Settings page</p>

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
          (t) =>
            html`
              <cme-token-item-edit
                .token="${t}"
                slot="body"
              ></cme-token-item-edit>
            `
        )}
        <p>
          <vscode-button
            @click="${this._onImportButtonClick}"
            icon="folder-opened"
            >Open</vscode-button
          >
          <vscode-button
            icon="save"
            >Save</vscode-button
          >
        </p>
      </div>
    `;
  }
}
