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
  blankLineAfterSubject?: boolean;
  subjectMode?: SubjectFormattingMode;
  subjectLength?: number;
  lineLength?: number;
  tabSize?: number;
  indentWithTabs?: boolean;
}

class CommitMessageFormatter {
  private _blankLineAfterSubject: boolean;
  private _subjectMode: SubjectFormattingMode;
  private _subjectLength: number;
  private _lineLength: number;
  private _tabSize: number;
  private _indentWithTabs: boolean;

  constructor({
    blankLineAfterSubject = false,
    subjectMode = SubjectFormattingMode.TRUNCATE,
    subjectLength = 50,
    lineLength = 72,
    tabSize = 2,
    indentWithTabs = false,
  }: CommitMessageFormatterOptions) {
    this._blankLineAfterSubject = blankLineAfterSubject;
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

  set blankLineAfterSubject(val: boolean) {
    this._blankLineAfterSubject = val;
  }

  get blankLineAfterSubject(): boolean {
    return this._blankLineAfterSubject;
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

      return {
        formatted: rawLine,
        rest: rawText.substring(rawLineLength),
      };
    }

    if (this._subjectMode === SubjectFormattingMode.TRUNCATE) {
      const formatted = rawLine.substring(0, this._subjectLength);
      const rest = rawText.substring(this._subjectLength);

      return {
        formatted,
        rest,
      };
    }

    if (this._subjectMode === SubjectFormattingMode.TRUNCATE_ELLIPSES) {
      const formatted = rawText.substring(0, this._subjectLength - 3) + '...';

      return {
        formatted,
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
    const remainingLine = rawLine.substring(leadingText.length);
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
        charCount = leadingText.length + word.length;
      }
    });

    return {
      formatted: formattedLine,
      rest: rawText.substring(nextNlPos + 1),
    };
  }

  private _reflow(message: string) {
    console.log(message);
    const lines = message.split('\n');
    const joinedLines: string[] = [];
    let currentJoinedLine = '';
    let prevLineType: 'none' | 'listitem' | 'indented' | 'empty' = 'none';

    lines.forEach((l, i) => {
      const {isListItem, isEmpty, isIndented} = this._analyzeLine(l);

      if (isListItem) {
        console.log('listitem');
        if (currentJoinedLine !== '') {
          joinedLines.push(currentJoinedLine);
        }
        currentJoinedLine = l;
        prevLineType = 'listitem';
        // TODO: elsif: indented && !listItem
      } else if (isIndented) {
        console.log('indented');

        /* if (currentJoinedLine !== '') {
          joinedLines.push(currentJoinedLine);
        }
 */
        if (prevLineType === 'listitem' || prevLineType === 'indented') {
          const prependedSpace = currentJoinedLine !== '' ? ' ' : '';
          currentJoinedLine += prependedSpace + l.trimLeft();
        } else {
          joinedLines.push(currentJoinedLine);
          currentJoinedLine = l;
        }
        prevLineType = 'indented';
      } else if (isEmpty) {
        console.log('is empty');
        if (currentJoinedLine !== '') {
          joinedLines.push(currentJoinedLine);
        }
        joinedLines.push('');
        currentJoinedLine = '';
        prevLineType = 'empty';
      } else {
        console.log('else');
        const prependedSpace = currentJoinedLine !== '' ? ' ' : '';
        currentJoinedLine += prependedSpace + l.trimStart().trimEnd();
      }

      if (i === lines.length - 1 && !isEmpty) {
        joinedLines.push(currentJoinedLine);
      }
    });

    return joinedLines.join('\n');
  }

  format(message: string): string {
    if (message.length <= this._subjectLength) {
      return message;
    }

    const subject = this.formatSubject(message);

    let {formatted, rest} = subject;

    // Removes the whitespaces that accidentally prepended the body with:
    rest = rest.replace(/^([ ]+)/g, '');

    const nlMatches = /^[\n]+/gm.exec(rest);
    const nlsAtTheBeginning = nlMatches ? nlMatches[0].length : 0;
    const minRequiredNls = this._blankLineAfterSubject ? 2 : 1;

    if (nlsAtTheBeginning < minRequiredNls) {
      rest = ''.padStart(minRequiredNls - nlsAtTheBeginning, '\n') + rest;
    }

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
