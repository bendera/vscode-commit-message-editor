import {RecentCommits} from '../components/cme-recent-commits';
// import {expect, fixture, html} from '@open-wc/testing';

const assert = chai.assert;

suite('cme-recent-commits', () => {
  test('is defined', () => {
    const el = document.createElement('cme-recent-commits');
    assert.instanceOf(el, RecentCommits);
  });

  /* test('renders with default values', async () => {
    const el = await fixture(html`<my-button></my-button>`);
    assert.shadowDom.equal(
      el,
      `Click me!`
    );

    expect(el).shadowDom.to.equalSnapshot();
  }); */
});
