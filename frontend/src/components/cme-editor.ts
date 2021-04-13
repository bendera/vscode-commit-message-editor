import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  internalProperty,
} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-tabs';
import './cme-text-view';
import './cme-form-view';
import store, {RootState} from '../store/store';

@customElement('cme-editor')
export class Editor extends connect(store)(LitElement) {
  @internalProperty()
  private _selectedIndex = 0;

  @internalProperty()
  private _visibleViews: VisibleViewsConfig = 'both';

  @internalProperty()
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
        max-width: 763px;
        width: 100%;
      }

      .wrapper.full {
        max-width: none;
      }
    `;
  }

  render(): TemplateResult {
    const textView = html`<cme-text-view></cme-text-view>`;
    const formView = html`<cme-form-view></cme-form-view>`;
    const wrapperClasses = classMap({
      wrapper: true,
      full: this._fullWidth,
    })

    const tabs = html`
      <div class="${wrapperClasses}">
        <vscode-tabs selectedIndex="${this._selectedIndex}">
          <header slot="header">Edit as text</header>
          <section>${textView}</section>
          <header slot="header">Edit as form</header>
          <section>${formView}</section>
        </vscode-tabs>
      </div>
    `;

    let content: TemplateResult;

    if (this._visibleViews === 'text') {
      content = textView;
    } else if (this._visibleViews === 'form') {
      content = formView;
    } else {
      content = tabs;
    }

    switch (this._visibleViews) {
      case 'text':
        content = textView;
        break;
      case 'form':
        content = formView;
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
