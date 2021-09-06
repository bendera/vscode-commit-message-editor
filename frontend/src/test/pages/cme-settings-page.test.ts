import {expect} from '@open-wc/testing';
import {SettingsPage} from '../../pages/cme-settings-page';

describe('cme-settings-page', () => {
  it('is defined', () => {
    const el = document.createElement('cme-settings-page');
    expect(el).to.instanceOf(SettingsPage);
  });
});
