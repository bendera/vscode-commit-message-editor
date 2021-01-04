import {Editor} from '../../components/cme-editor';
// import {expect, fixture, html} from '@open-wc/testing';

const assert = chai.assert;

suite('cme-editor', () => {
  test('is defined', () => {
    const el = document.createElement('cme-editor');
    assert.instanceOf(el, Editor);
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
