import {css, CSSResult, html, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@bendera/vscode-webview-elements/dist/vscode-tree';
import '@bendera/vscode-webview-elements/dist/vscode-icon';

const transformCommitList = (commits: Commit[], maxItems: number) => {
  if (!Array.isArray(commits)) {
    return [];
  }

  let list = commits;

  if (commits.length > maxItems) {
    list = commits.slice(0, maxItems);
  }

  return list.map((item) => {
    const {message} = item;
    const lines = message.split('\n');

    return {
      label: lines[0],
      value: message,
    };
  });
};

@customElement('cme-recent-commits')
export class RecentCommits extends LitElement {
  @property({type: Array}) data: Commit[] | undefined = [];
  @property({type: Boolean}) loading = false;
  @property({type: Number}) maxItems = 10;

  private _handleItemSelect(ev: CustomEvent) {
    this.dispatchEvent(
      new CustomEvent('cme-select', {
        detail: ev.detail.value,
      })
    );
  }

  static get styles(): CSSResult {
    return css`
      @keyframes pulse {
        0% {
          opacity: 0.03;
        }

        50% {
          opacity: 0.1;
        }

        100% {
          opacity: 0.03;
        }
      }

      :host {
        display: block;
        user-select: none;
      }

      .title {
        color: var(--vscode-settings-headerForeground);
        font-size: var(--vscode-font-size);
        font-weight: 600;
        line-height: 22px;
        margin: 0;
      }

      .spinner-wrapper {
        display: flex;
        justify-content: center;
        margin: 8px 0;
      }

      .placeholder-item {
        animation: pulse 1.5s infinite;
        box-sizing: border-box;
        height: 22px;
        margin-left: 22px;
        opacity: 0.1;
        padding-top: 7px;
        position: relative;
      }

      .placeholder-item:before {
        background-color: var(--vscode-editor-foreground);
        content: '';
        display: block;
        height: 16px;
        left: -22px;
        position: absolute;
        top: 3px;
        width: 16px;
      }

      .placeholder-item:after {
        background-color: var(--vscode-editor-foreground);
        content: '';
        display: block;
        height: 9px;
      }
    `;
  }

  render(): TemplateResult {
    const treeData =
      this.data !== undefined
        ? transformCommitList(this.data, this.maxItems).map(
            ({label, value}) => ({
              icons: {
                leaf: 'git-commit',
              },
              label,
              value,
            })
          )
        : [];

    const placeholderItems = Array(this.maxItems).fill(
      html`<div class="placeholder-item"></div>`
    );

    return html`
      <h2 class="title">Recent commits:</h2>
      ${
        this.loading
          ? html`<div class="placeholder">${placeholderItems}</div>`
          : html`<vscode-tree
              tabindex="0"
              .data="${treeData}"
              @vsc-select="${this._handleItemSelect}"
            ></vscode-tree>`
      }
      </div>
    `;
  }
}
