// type SubjectMode = 'truncate' | 'truncate-ellipses';

export enum SubjectMode {
  TRUNCATE,
  TRUNCATE_ELLIPSES,
  TRUNCATE_ELLIPSIS_BEFORE,
  TRUNCATE_ELLIPSIS_AFTER,
}

interface CommitMessageFormatterOptions {
  blankLineAfterSubject?: boolean;
  subjectMode?: SubjectMode;
  subjectLength?: number;
  lineLength?: number;
}

class CommitMessageFormatter {
  // private _blankLineAfterSubject: boolean;
  private _subjectMode: SubjectMode;
  private _subjectLength: number;
  private _lineLength: number;

  constructor({
    // blankLineAfterSubject = false,
    subjectMode = SubjectMode.TRUNCATE,
    subjectLength = 50,
    lineLength = 72,
  }: CommitMessageFormatterOptions) {
    // this._blankLineAfterSubject = blankLineAfterSubject;
    this._subjectMode = subjectMode;
    this._subjectLength = subjectLength;
    this._lineLength = lineLength;
  }

  formatSubject(rawText: string): {formatted: string; rest: string} {
    const nextNlPos = rawText.indexOf('\n');
    const rawLine = rawText.substring(0, nextNlPos);

    if (rawLine.length <= this._subjectLength) {
      return {
        formatted: rawLine,
        rest: rawText.substring(nextNlPos),
      };
    }

    if (this._subjectMode === SubjectMode.TRUNCATE) {
      return {
        formatted: rawLine.substring(0, this._subjectLength),
        rest: rawText.substring(rawLine.length),
      };
    }

    if (this._subjectMode === SubjectMode.TRUNCATE_ELLIPSIS_BEFORE) {
      return {
        formatted: rawText.substring(0, this._subjectLength - 3) + '...',
        rest: rawText.substring(this._subjectLength - 3),
      };
    }

    if (this._subjectMode === SubjectMode.TRUNCATE_ELLIPSIS_AFTER) {
      return {
        formatted: rawText.substring(0, this._subjectLength),
        rest: '...' + rawText.substring(this._subjectLength),
      };
    }

    if (this._subjectMode === SubjectMode.TRUNCATE_ELLIPSES) {
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

    let formattedLine = '';
    let indentationLength = 0;
    let padText = '';
    const matches = /^[\W0-9]+/gm.exec(rawLine);

    if (matches) {
      // replace any bullet-type character with space
      padText = matches[0].replaceAll(/\S/g, ' ');
      indentationLength = matches[0].length;
      formattedLine = matches[0];
    }

    const remainingLine = rawLine.substring(indentationLength);
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
