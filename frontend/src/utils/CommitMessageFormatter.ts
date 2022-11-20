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
  reflowParagraphs?: boolean;
}

class CommitMessageFormatter {
  // private _blankLineAfterSubject: boolean;
  private _subjectMode: SubjectFormattingMode;
  private _subjectLength: number;
  private _lineLength: number;
  private _tabSize: number;
  private _indentWithTabs: boolean;
  private _reflowParagraphs: boolean;

  constructor({
    // blankLineAfterSubject = false,
    subjectMode = SubjectFormattingMode.TRUNCATE,
    subjectLength = 50,
    lineLength = 72,
    tabSize = 2,
    indentWithTabs = false,
    reflowParagraphs = true,
  }: CommitMessageFormatterOptions) {
    // this._blankLineAfterSubject = blankLineAfterSubject;
    this._subjectMode = subjectMode;
    this._subjectLength = subjectLength;
    this._lineLength = lineLength;
    this._tabSize = tabSize;
    this._indentWithTabs = indentWithTabs;
    this._reflowParagraphs = reflowParagraphs;
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

  private _analyzeLine(line: string) {
    let isListItem = false;
    let isIndented = false;
    let isEmpty = false;
    let listItemPrefix = '';
    let indentationWidth = 0;
    let indentationText = '';
    let leadingText = '';

    const reOrderedList = /^[\t ]*(.?[0-9a-zA-Z]\.{1}\)*[\t ]+)/g;
    const reUnorderedList = /^[\t ]*([*-]{1}[\t ]+)/g;
    const reIndentation = /^[\t ]+/g;

    const orderedListMatches = reOrderedList.exec(line);
    const unorderedListMatches = reUnorderedList.exec(line);
    const indentationMatches = reIndentation.exec(line);

    if (line === '') {
      isEmpty = true;
    }

    if (indentationMatches) {
      isIndented = true;
    }

    if (orderedListMatches) {
      isListItem = true;
      leadingText = orderedListMatches[0];
      listItemPrefix = orderedListMatches[1];
    }

    if (unorderedListMatches) {
      isListItem = true;
      leadingText = unorderedListMatches[0];
      listItemPrefix = unorderedListMatches[1];
    }

    if (indentationMatches && !isListItem) {
      leadingText = indentationMatches[0];
    }

    indentationWidth = calculateNumberOfTextColumns(leadingText, this._tabSize);

    if (!this._indentWithTabs) {
      indentationText = ''.padStart(indentationWidth, ' ');
    } else {
      indentationText = ''.padStart(
        Math.ceil(indentationWidth / this._tabSize),
        '\t'
      );
    }

    return {
      isListItem,
      isIndented,
      isEmpty,
      listItemPrefix,
      indentationWidth,
      indentationText,
      leadingText,
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

    const {indentationText, indentationWidth, leadingText} =
      this._analyzeLine(rawLine);

    let formattedLine = leadingText;
    const remainingLine = rawLine.substring(indentationWidth);
    const availableLength = this._lineLength - indentationWidth;
    const words = remainingLine.split(' ');
    let charCount = 0;

    words.forEach((word, i) => {
      const pad = i === 0 ? '' : ' ';

      if (charCount + pad.length + word.length <= availableLength) {
        formattedLine += pad + word;
        charCount += pad.length + word.length;
      } else {
        formattedLine += '\n';
        formattedLine += indentationText;
        formattedLine += word;
        charCount = indentationWidth + word.length;
      }
    });

    return {
      formatted: formattedLine,
      rest: rawText.substring(nextNlPos + 1),
    };
  }

  private _reflow(message: string) {
    const lines = message.split('\n');
    const joinedLines: string[] = [];
    let currentJoinedLine = '';

    lines.forEach((l) => {
      const {isListItem, isEmpty} = this._analyzeLine(l);
      console.log('empty', isEmpty)

      if (isListItem || isEmpty) {
        joinedLines.push(currentJoinedLine);
        currentJoinedLine = l;
      } else {
        const prependedSpace = currentJoinedLine !== '' ? ' ' : '';
        currentJoinedLine +=
          prependedSpace + l.replaceAll(/^[\t ]+|[\t ]$/g, '');
      }
    });

    joinedLines.push(currentJoinedLine);

    return joinedLines.join('\n');
  }

  format(message: string): string {
    if (message.length <= this._subjectLength) {
      return message;
    }

    const subject = this.formatSubject(message);
    let {formatted, rest} = subject;

    rest = this._reflow(rest);

    while (rest.length > this._lineLength) {
      const next = this.formatNextLine(rest);

      formatted += next.formatted;
      rest = next.rest;
    }

    return formatted + rest;
  }
}

export default CommitMessageFormatter;
