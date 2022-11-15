import {expect} from '@esm-bundle/chai';
import CommitMessageFormatter, {
  SubjectMode,
} from '../../utils/CommitMessageFormatter';
import { shortSubjectRaw } from './_fixtures';

describe('CommitMessageFormatter', () => {
  it('subject should be untouched when actual subject lenght is less than maximum subject length', () => {
    const formatter = new CommitMessageFormatter({
      subjectLength: 20,
      lineLength: 100,
    });

    expect(formatter.format(shortSubjectRaw)).to.eq(shortSubjectRaw);
  });

  it('truncate mode', () => {
    const rawText = 'Lorem ipsum\ndolor sit amet, consectetur adipiscing elit.';

    const formatter = new CommitMessageFormatter({
      subjectLength: 5,
      lineLength: 100,
      subjectMode: SubjectMode.TRUNCATE,
    });

    expect(formatter.format(rawText)).to.eq(
      'Lorem\ndolor sit amet, consectetur adipiscing elit.'
    );
  });

  it('lists', () => {
    const rawText = [
      'Lorem ipsum',
      '',
      ' * Phasellus urna ante, scelerisque sit amet malesuada id, vulputate dictum massa. Vivamus pharetra turpis justo, a consectetur arcu lobortis nec.',
      ' * Vivamus pulvinar diam vitae purus aliquet, ut varius nisl cursus.'
    ].join('\n');

    const expected = [
      'Lorem ipsum',
      '',
      ' * Phasellus urna ante, scelerisque sit amet malesuada id, vulputate dictum',
      '   massa. Vivamus pharetra turpis justo, a consectetur arcu lobortis nec.',
      ' * Vivamus pulvinar diam vitae purus aliquet, ut varius nisl cursus.'
    ].join('\n');

    const formatter = new CommitMessageFormatter({
      subjectLength: 20,
      lineLength: 80,
      subjectMode: SubjectMode.TRUNCATE,
    });

    expect(formatter.format(rawText)).to.eq(expected);
  });

  it('tab indentation', () => {
    const rawText = [
      'Lorem ipsum',
      '',
      '\t*\tPhasellus urna ante, scelerisque sit amet malesuada id, vulputate dictum massa. Vivamus pharetra turpis justo, a consectetur arcu lobortis nec.',
      '\t*\tVivamus pulvinar diam vitae purus aliquet, ut varius nisl cursus.'
    ].join('\n');

    const expected = [
      'Lorem ipsum',
      '',
      '\t*\tPhasellus urna ante, scelerisque sit amet malesuada id, vulputate dictum',
      '\t \tmassa. Vivamus pharetra turpis justo, a consectetur arcu lobortis nec.',
      '\t*\tVivamus pulvinar diam vitae purus aliquet, ut varius nisl cursus.'
    ].join('\n');

    const formatter = new CommitMessageFormatter({
      subjectLength: 20,
      lineLength: 80,
      subjectMode: SubjectMode.TRUNCATE,
    });

    expect(formatter.format(rawText)).to.eq(expected);
  });
});
