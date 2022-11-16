import calculateNumberOfTextColumns from './calculateNumberOfTextColumns';

export enum SubjectFormattingMode {
  /**
   * Subject will be cut at the maximum length, rest will be added to the body.
   */
  TRUNCATE = 'truncate',
  /**
   * Subject will be cut at the maximum length, then ellipses (...) will be
   * added. Rest will be added to the body and prefixed with ellipses.
   */
  TRUNCATE_ELLIPSES = 'truncate-ellipses',
  /**
   * Split by words.
   */
  SPLIT = 'split',
}

interface CommitMessageFormatterOptions {
  // blankLineAfterSubject?: boolean;
  subjectMode?: SubjectFormattingMode;
  subjectLength?: number;
  lineLength?: number;
  tabSize?: number;
  indentWithTabs?: boolean;
}

class CommitMessageFormatter {
  // private _blankLineAfterSubject: boolean;
  private _subjectMode: SubjectFormattingMode;
  private _subjectLength: number;
  private _lineLength: number;
  private _tabSize: number;
  private _indentWithTabs: boolean;

  constructor({
    // blankLineAfterSubject = false,
    subjectMode = SubjectFormattingMode.TRUNCATE,
    subjectLength = 50,
    lineLength = 72,
    tabSize = 2,
    indentWithTabs = false,
  }: CommitMessageFormatterOptions) {
    // this._blankLineAfterSubject = blankLineAfterSubject;
    this._subjectMode = subjectMode;
    this._subjectLength = subjectLength;
    this._lineLength = lineLength;
    this._tabSize = tabSize;
    this._indentWithTabs = indentWithTabs;
  }

  set subjectMode(val: SubjectFormattingMode) {
    this._subjectMode = val;
  }

  get subjectMode(): SubjectFormattingMode {
    return this._subjectMode;
  }

  set subjectLength(val: number) {
    this._subjectLength = val;
  }

  get subjectLength(): number {
    return this._subjectLength;
  }

  set lineLength(val: number) {
    this._lineLength = val;
  }

  get lineLength(): number {
    return this._lineLength;
  }

  set tabSize(val: number) {
    this._tabSize = val;
  }

  get tabSize(): number {
    return this._tabSize;
  }

  set indentWithTabs(val: boolean) {
    this._indentWithTabs = val;
  }

  get indentWithTabs(): boolean {
    return this._indentWithTabs;
  }

  formatSubject(rawText: string): {formatted: string; rest: string} {
    const nextNlPos = rawText.indexOf('\n');
    let rawLine = '';

    if (nextNlPos > -1) {
      rawLine = rawText.substring(0, nextNlPos);
    } else {
      rawLine = rawText;
    }

    if (rawLine.length <= this._subjectLength) {
      const rawLineLength = rawLine.length;
      let formatted = rawLine;

      if (nextNlPos === -1) {
        formatted = rawLine + '\n';
      }

      return {
        formatted,
        rest: rawText.substring(rawLineLength),
      };
    }

    if (this._subjectMode === SubjectFormattingMode.TRUNCATE) {
      let formatted = rawLine.substring(0, this._subjectLength).trimEnd();
      const rest = rawText.substring(this._subjectLength).trimStart();

      formatted += '\n';

      return {
        formatted,
        rest,
      };
    }

    if (this._subjectMode === SubjectFormattingMode.TRUNCATE_ELLIPSES) {
      return {
        formatted: rawText.substring(0, this._subjectLength - 3) + '...',
        rest: '...' + rawText.substring(this._subjectLength - 3),
      };
    }

    return {
      formatted: '',
      rest: '',
    };
  }

  private _getIndentationData(rawLine: string) {
    // match with list item prefixes and indentation
    //
    // 1. list item
    // 1.) list item
    // i. list item
    // i.) list item
    // * list item
    // - list item
    //   indented text
    const matches =
      /^[\t ]+(.?[0-9a-zA-Z]\.{1}\)*[\t ]+)|^[\t| ]+([*-]{1})[\t| ]+|^[\t ]+/g.exec(
        rawLine
      );

    let leadingText = '';
    let leadingTextCols = 0;
    let padText = '';
    let padTextCols = 0;

    if (matches) {
      leadingText = matches[0];
      leadingTextCols = calculateNumberOfTextColumns(matches[0], this._tabSize);
      const indentationLevel = Math.ceil(leadingTextCols / this._tabSize);
      const additionalColumns =
        indentationLevel * this._tabSize - leadingTextCols;
      padTextCols = leadingTextCols + additionalColumns;

      if (this._indentWithTabs) {
        padText = ''.padStart(padTextCols / this._tabSize, '\t');
      } else {
        padText = ''.padStart(padTextCols, ' ');
      }
    }

    return {
      leadingText,
      leadingTextCols,
      padText,
      padTextCols,
    };
  }

  formatNextLine(rawText: string): {formatted: string; rest: string} {
    let nextNlPos = rawText.indexOf('\n');

    if (nextNlPos === -1) {
      nextNlPos = rawText.length;
    }

    const rawLine = rawText.substring(0, nextNlPos + 1);

    if (rawLine.length < this._lineLength) {
      return {
        formatted: rawLine,
        rest: rawText.substring(nextNlPos + 1),
      };
    }

    const {padText, leadingText, padTextCols} =
      this._getIndentationData(rawLine);
    const indentationLength = padTextCols;
    let formattedLine = leadingText;
    const remainingLine = rawLine.substring(leadingText.length);
    const availableLength = this._lineLength - indentationLength;
    const words = remainingLine.split(' ');
    let charCount = 0;

    words.forEach((word, i) => {
      const pad = i === 0 ? '' : ' ';

      if (charCount + pad.length + word.length <= availableLength) {
        formattedLine += pad + word;
        charCount += pad.length + word.length;
      } else {
        formattedLine += '\n';
        formattedLine += padText;
        formattedLine += word;
        charCount = indentationLength + word.length;
      }
    });

    return {
      formatted: formattedLine,
      rest: rawText.substring(nextNlPos + 1),
    };
  }

  format(message: string): string {
    if (message.length <= this._subjectLength) {
      return message;
    }

    const subject = this.formatSubject(message);
    let {formatted, rest} = subject;

    while (rest.length > this._lineLength) {
      const next = this.formatNextLine(rest);

      formatted += next.formatted;
      rest = next.rest;
    }

    return formatted + rest;
  }
}

export default CommitMessageFormatter;
