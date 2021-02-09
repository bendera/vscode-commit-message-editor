import {expect, fixture, html} from '@open-wc/testing';
import sinon, {SinonSpy} from 'sinon';
import commits from '../_data/commits';
import {RecentCommits} from '../../components/cme-recent-commits';

describe('cme-recent-commits', () => {
  it('is defined', () => {
    const el = document.createElement('cme-recent-commits');
    expect(el).to.instanceOf(RecentCommits);
  });

  it('a placeholder animation should be displayed during the data is loading', async () => {
    const el: RecentCommits = await fixture(
      html`<cme-recent-commits loading></cme-recent-commits>`
    );

    expect(el).shadowDom.to.equal(`
      <h2 class="title">Recent commits:</h2>
      <div class="placeholder">
        <div class="placeholder-item"></div>
        <div class="placeholder-item"></div>
        <div class="placeholder-item"></div>
        <div class="placeholder-item"></div>
        <div class="placeholder-item"></div>
        <div class="placeholder-item"></div>
        <div class="placeholder-item"></div>
        <div class="placeholder-item"></div>
        <div class="placeholder-item"></div>
        <div class="placeholder-item"></div>
      </div>
    `);
  });

  it('only limited items should be visible when maxItems is set', async () => {
    const el: RecentCommits = await fixture(
      html`<cme-recent-commits loading maxItems="2"></cme-recent-commits>`
    );

    expect(el).shadowDom.to.equal(`
      <h2 class="title">Recent commits:</h2>
      <div class="placeholder">
        <div class="placeholder-item"></div>
        <div class="placeholder-item"></div>
      </div>
    `);
  });

  it('recent commits should be visible', async () => {
    const el = await fixture(html`<cme-recent-commits></cme-recent-commits>`);
    (el as RecentCommits).data = [commits[0]];

    await (el as RecentCommits).updateComplete;

    const tree = el.shadowRoot?.querySelector('vscode-tree');

    expect(el).shadowDom.to.equal(`
      <h2 class="title">Recent commits:</h2>
      <vscode-tree tabindex="0"></vscode-tree>
    `);
    expect(tree?.data).to.deep.equal([
      {
        icons: {
          leaf: 'git-commit',
        },
        label: 'No need to create fake workspace folder for query builder',
        value:
          'No need to create fake workspace folder for query builder\nFix #111348',
      },
    ]);
  });

  it('only limited commits should be visible when maxItems is set', async () => {
    const el: RecentCommits = await fixture(
      html`<cme-recent-commits maxItems="2"></cme-recent-commits>`
    );
    (el as RecentCommits).data = [commits[0], commits[1], commits[2]];

    await (el as RecentCommits).updateComplete;

    const tree = el.shadowRoot?.querySelector('vscode-tree');

    const expected = [
      {
        icons: {
          leaf: 'git-commit',
        },
        label: 'No need to create fake workspace folder for query builder',
        value:
          'No need to create fake workspace folder for query builder\nFix #111348',
      },
      {
        icons: {
          leaf: 'git-commit',
        },
        label: "Don't use 'expandPatterns' for workspaceContains search",
        value:
          "Don't use 'expandPatterns' for workspaceContains search\nFix #110510",
      },
    ];

    expect(tree?.data).to.deep.equal(expected);
  });

  it('cme-select event should be dispatched when a list item is selected', async () => {
    const el: RecentCommits = await fixture(
      html`<cme-recent-commits></cme-recent-commits>`
    );

    const onSelectSpy = sinon.spy();
    el.addEventListener('cme-select', onSelectSpy);

    const tree = el.shadowRoot?.querySelector('vscode-tree');

    tree?.dispatchEvent(
      new CustomEvent('vsc-select', {
        detail: {
          value: 'test value',
        },
      })
    );

    expect((onSelectSpy as SinonSpy).firstCall.args[0].detail).to.be.eq(
      'test value'
    );
  });
});
