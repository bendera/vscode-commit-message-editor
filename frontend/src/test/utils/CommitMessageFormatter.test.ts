import {expect} from '@esm-bundle/chai';
import CommitMessageFormatter from '../../utils/CommitMessageFormatter'; // SubjectFormattingMode,
import {
  indentWithTabsRaw,
  indentWithTabsWrapped,
  listAlphaBraketTabsRaw,
  listAlphaBraketTabsWrapped,
  listAlphaTabsRaw,
  listAlphaTabsWrapped,
  listAsteriskTabsRaw,
  listAsteriskTabsWrapped,
  listDashTabsRaw,
  listDashTabsWrapped,
  listDecimalTabsRaw,
  listDecimalTabsWrapped,
  shortSubjectRaw,
} from './_fixtures';

describe('CommitMessageFormatter', () => {
  it('subject should be untouched when actual subject lenght is less than maximum subject length', () => {
    const formatter = new CommitMessageFormatter({});

    expect(formatter.format(shortSubjectRaw)).to.eq(shortSubjectRaw);
  });

  it('indented with tabs', () => {
    const formatter = new CommitMessageFormatter({
      tabSize: 4,
      indentWithTabs: true,
    });

    expect(formatter.format(indentWithTabsRaw)).to.eq(indentWithTabsWrapped);
  });

  it('ordered decimal list, indented with tabs', () => {
    const formatter = new CommitMessageFormatter({
      tabSize: 4,
      indentWithTabs: true,
    });

    expect(formatter.format(listDecimalTabsRaw)).to.eq(listDecimalTabsWrapped);
  });

  it('ordered list with ascii letters, indented with tabs', () => {
    const formatter = new CommitMessageFormatter({
      tabSize: 4,
      indentWithTabs: true,
    });

    expect(formatter.format(listAlphaTabsRaw)).to.eq(listAlphaTabsWrapped);
  });

  it('ordered list with bracket after period, indented with tabs', () => {
    const formatter = new CommitMessageFormatter({
      tabSize: 4,
      indentWithTabs: true,
    });

    expect(formatter.format(listAlphaBraketTabsRaw)).to.eq(
      listAlphaBraketTabsWrapped
    );
  });

  it('unordered list with asterisk, indented with tabs', () => {
    const formatter = new CommitMessageFormatter({
      tabSize: 4,
      indentWithTabs: true,
    });

    expect(formatter.format(listAsteriskTabsRaw)).to.eq(
      listAsteriskTabsWrapped
    );
  });

  it('unordered list with dash, indented with tabs', () => {
    const formatter = new CommitMessageFormatter({
      tabSize: 4,
      indentWithTabs: true,
    });

    expect(formatter.format(listDashTabsRaw)).to.eq(listDashTabsWrapped);
  });
});
