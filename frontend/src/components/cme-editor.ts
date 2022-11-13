import {LitElement, html, css, CSSResult, TemplateResult} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-tabs';
import '@bendera/vscode-webview-elements/dist/vscode-tab-header';
import '@bendera/vscode-webview-elements/dist/vscode-tab-panel';
import './cme-text-view';
import './cme-form-view/cme-form-view';
import store, {RootState} from '../store/store';
import {getAPI} from '../utils/VSCodeAPIService';
import {TextView} from './cme-text-view';
import {FormView} from './cme-form-view/cme-form-view';

const vscode = getAPI();

@customElement('cme-editor')
export class Editor extends connect(store)(LitElement) {
  @state()
  private _selectedIndex = 0;

  @state()
  private _visibleViews: VisibleViewsConfig = 'both';

  @state()
  private _fullWidth = false;

  stateChanged(state: RootState): void {
    const {defaultView, visibleViews, fullWidth} =
      state.config['commit-message-editor'].view;

    this._selectedIndex = defaultView === 'text' ? 0 : 1;
    this._visibleViews = visibleViews;
    this._fullWidth = fullWidth;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        position: relative;
      }

      .wrapper {
        margin: 0 auto 30px;
        max-width: 727px;
        position: relative;
        width: 100%;
      }

      .wrapper.full {
        max-width: none;
      }

      vscode-icon[name='settings-gear'] {
        position: absolute;
        right: 0;
      }

      .wrapper.both vscode-icon[name='settings-gear'] {
        top: 7px;
      }

      .wrapper.text vscode-icon[name='settings-gear'] {
        top: 0;
      }

      .wrapper.form vscode-icon[name='settings-gear'] {
        top: 12px;
      }
    `;
  }

  private _handleTabChange(ev: CustomEvent) {
    const activeViewSelector =
      ev.detail.selectedIndex === 0 ? 'cme-text-view' : 'cme-form-view';
    type Content = TextView | FormView;

    const el = this.shadowRoot?.querySelector(activeViewSelector) as Content;
    el.visibleCallback();
  }

  private _onSettingsIconClick() {
    vscode.postMessage({
      command: 'openConfigurationPage',
    });
  }

  private _renderPortableSettingsButton() {
    return html`<vscode-icon
      name="settings-gear"
      action-icon
      title="Edit commit templates"
      @click="${this._onSettingsIconClick}"
    ></vscode-icon>`;
  }

  render(): TemplateResult {
    const textView = html`<cme-text-view></cme-text-view>`;
    const formView = html`<cme-form-view></cme-form-view>`;

    const tabs = html`
      <div
        class="${classMap({
          wrapper: true,
          full: this._fullWidth,
          both: true,
        })}"
      >
        ${this._renderPortableSettingsButton()}
        <vscode-tabs
          selectedIndex="${this._selectedIndex}"
          @vsc-select="${this._handleTabChange}"
        >
          <vscode-tab-header>Edit as text</vscode-tab-header>
          <vscode-tab-panel>${textView}</vscode-tab-panel>
          <vscode-tab-header>Edit as form</vscode-tab-header>
          <vscode-tab-panel>${formView}</vscode-tab-panel>
        </vscode-tabs>
      </div>
    `;

    let content: TemplateResult;

    switch (this._visibleViews) {
      case 'text':
        content = html`
          <div
            class="${classMap({
              wrapper: true,
              full: this._fullWidth,
              text: true,
            })}"
          >
            ${this._renderPortableSettingsButton()} ${textView}
          </div>
        `;
        break;
      case 'form':
        content = html`
          <div
            class="${classMap({
              wrapper: true,
              full: this._fullWidth,
              form: true,
            })}"
          >
            ${this._renderPortableSettingsButton()} ${formView}
          </div>
        `;
        break;
      default:
        content = tabs;
    }

    return content;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cme-editor': Editor;
  }
}
