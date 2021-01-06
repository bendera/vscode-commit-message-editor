import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  internalProperty,
} from 'lit-element';
import {nothing} from 'lit-html';
import {ifDefined} from 'lit-html/directives/if-defined';
import {connect} from 'pwa-helpers';
import '@bendera/vscode-webview-elements/dist/vscode-button';
import '@bendera/vscode-webview-elements/dist/vscode-checkbox';
import '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import '@bendera/vscode-webview-elements/dist/vscode-form-control';
import '@bendera/vscode-webview-elements/dist/vscode-form-description';
import '@bendera/vscode-webview-elements/dist/vscode-form-item';
import '@bendera/vscode-webview-elements/dist/vscode-form-label';
import '@bendera/vscode-webview-elements/dist/vscode-option';
import '@bendera/vscode-webview-elements/dist/vscode-select';
import store, {RootState} from '../store/store';
import {confirmAmend, closeTab, copyToSCMInputBox} from '../store/actions';

@customElement('cme-form-view')
export class FormView extends connect(store)(LitElement) {
  @internalProperty()
  private _saveAndClose = false;

  @internalProperty()
  private _tokens: Token[] = [];

  @internalProperty()
  private _amendCbChecked = false;

  stateChanged(state: RootState): void {
    const {config} = state;

    this._saveAndClose = config.view.saveAndClose;
    this._tokens = config.tokens;
  }

  private _renderFormItem(
    widget: TemplateResult,
    label: string,
    description = ''
  ) {
    let desc = nothing;

    if (description) {
      desc = html`<vscode-form-description
        >${description}</vscode-form-description
      >`;
    }

    return html`
      <vscode-form-item>
        <vscode-form-label>${label}</vscode-form-label>
        ${desc}
        <vscode-form-control> ${widget} </vscode-form-control>
      </vscode-form-item>
    `;
  }

  private _renderEnumTypeWidget(token: Token) {
    const {description, label, name} = token;

    const options = token.options?.map((op) => {
      const {label, value, description} = op;

      return html`
        <vscode-option
          value="${ifDefined(value)}"
          description="${ifDefined(description)}"
          >${label}</vscode-option
        >
      `;
    });

    const select = html`
      <vscode-select
        data-name="${name}"
        @vsc-change="${this._handleFormItemChange}"
        >${options}</vscode-select
      >
    `;

    return this._renderFormItem(select, label, description);
  }

  private _renderTextTypeWidget(token: Token) {
    const {description, label, multiline, name} = token;

    const inputbox = html`
      <vscode-inputbox
        data-name="${name}"
        ?multiline="${multiline}"
        @vsc-change="${this._handleFormItemChange}"
      ></vscode-inputbox>
    `;

    return this._renderFormItem(inputbox, label, description);
  }

  private _renderBooleanTypeWidget(token: Token) {
    const {description, label, name, value} = token;

    const checkbox = html`
      <vscode-checkbox
        data-name="${name}"
        value="${value}"
        label="${label}"
        @vsc-change="${this._handleFormItemChange}"
      ></vscode-checkbox>
    `;

    return this._renderFormItem(checkbox, label, description);
  }

  private _handleFormItemChange(ev: CustomEvent) {
    console.log(ev);

    if ((ev.target as Element).tagName.toLowerCase() === 'vscode-checkbox') {
      const {checked} = ev.detail;

      if (checked) {
        console.log(ev.target.value);
      }
    } else {
      console.log(ev.target.value);
    }
  }

  private _handleSuccessButtonClick() {
    store.dispatch(copyToSCMInputBox('foo'));

    if (this._amendCbChecked) {
      store.dispatch(confirmAmend());
    }

    if (this._saveAndClose) {
      store.dispatch(closeTab());
    }
  }

  private _handleCancelButtonClick() {
    store.dispatch(closeTab());
  }

  private _handleCheckBoxChange(ev: CustomEvent) {
    const {checked} = ev.detail;

    this._amendCbChecked = checked;
  }

  static get styles(): CSSResult {
    return css`
      .buttons {
        align-items: center;
        display: flex;
        margin-top: 10px;
      }

      .buttons .cb-amend {
        margin-left: 20px;
      }

      .buttons vscode-button {
        margin-right: 10px;
      }
    `;
  }

  render(): TemplateResult {
    const formElements = this._tokens.map((token) => {
      switch (token.type) {
        case 'enum':
          return this._renderEnumTypeWidget(token);
        case 'text':
          return this._renderTextTypeWidget(token);
        case 'boolean':
          return this._renderBooleanTypeWidget(token);
        default:
          return nothing;
      }
    });

    return html`
      <div id="edit-form">${formElements}</div>
      <div class="buttons">
        <vscode-button
          id="success-button-form"
          @click="${this._handleSuccessButtonClick}"
          >${this._saveAndClose ? 'Save and close' : 'Save'}</vscode-button
        >
        <vscode-button @click="${this._handleCancelButtonClick}"
          >Cancel</vscode-button
        >
        <vscode-checkbox
          label="Amend previous commit"
          class="cb-amend"
          id="form-amend-checkbox"
          @vsc-change="${this._handleCheckBoxChange}"
        ></vscode-checkbox>
      </div>
    `;
  }
}
