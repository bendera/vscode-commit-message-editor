import {expect} from '@open-wc/testing';
import {TokenItemEdit} from '../../../components/cme-token-item-edit/cme-token-item-edit';

describe('cme-token-item-edit', () => {
  it('is defined', () => {
    const el = document.createElement('cme-token-item-edit');
    expect(el).to.instanceOf(TokenItemEdit);
  });
});
