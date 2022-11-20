import {expect} from '@esm-bundle/chai';
import calculateNumberOfTextColumns from '../../utils/calculateNumberOfTextColumns';
import {textWithSpaces, textWithTabs} from './_fixtures';

describe('calculateNumberOfTextColumns', () => {
  it('text with tabs', () => {
    expect(calculateNumberOfTextColumns(textWithTabs, 4)).to.eq(20);
  });

  it('text with spaces', () => {
    expect(calculateNumberOfTextColumns(textWithSpaces, 4)).to.eq(20);
  });
});
