import {expect} from '@esm-bundle/chai';
import CommitMessageFormatter from '../../utils/CommitMessageFormatter';

describe('CommitMessageFormatter', () => {
  it('subject length: 10, line length 20', () => {
    const rawText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

    const formatter = new CommitMessageFormatter({
      subjectLength: 10,
      lineLength: 20,
    });

    const expected = [
      'Lorem ipsu',
      'm dolor sit amet, co',
      'nsectetur adipiscing',
      ' elit.',
    ].join('\n');

    expect(formatter.format(rawText)).to.eq(expected);
  });
});
