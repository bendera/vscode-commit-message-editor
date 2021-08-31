import {LitElement, html, css, CSSResult, TemplateResult} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-tabs';
import './cme-text-view';
import './cme-form-view/cme-form-view';
import store, {RootState} from '../store/store';
import {TextView} from './cme-text-view';
import {FormView} from './cme-form-view/cme-form-view';

@customElement('cme-editor')
export class Editor extends connect(store)(LitElement) {
  @state()
  private _selectedIndex = 0;

  @state()
  private _visibleViews: VisibleViewsConfig = 'both';

  @state()
  private _fullWidth = false;

  stateChanged(state: RootState): void {
    const {defaultView, visibleViews, fullWidth} = state.config.view;

    this._selectedIndex = defaultView === 'text' ? 0 : 1;
    this._visibleViews = visibleViews;
    this._fullWidth = fullWidth;
  }

  static get styles(): CSSResult {
    return css`
      .wrapper {
        margin: 0 auto 30px;
        max-width: 727px;
        width: 100%;
      }

      .wrapper.full {
        max-width: none;
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

  render(): TemplateResult {
    const wrapperClasses = classMap({
      wrapper: true,
      full: this._fullWidth,
    });

    const textView = html`<cme-text-view></cme-text-view>`;
    const formView = html`<cme-form-view></cme-form-view>`;

    const tabs = html`
      <div class="${wrapperClasses}">
        <vscode-tabs
          selectedIndex="${this._selectedIndex}"
          @vsc-select="${this._handleTabChange}"
        >
          <header slot="header">Edit as text</header>
          <section>${textView}</section>
          <header slot="header">Edit as form</header>
          <section>${formView}</section>
        </vscode-tabs>
      </div>
    `;

    let content: TemplateResult;

    switch (this._visibleViews) {
      case 'text':
        content = html`<div class="${wrapperClasses}">${textView}</div>`;
        break;
      case 'form':
        content = html`<div class="${wrapperClasses}">${formView}</div>`;
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
