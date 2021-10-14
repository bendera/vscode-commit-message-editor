interface CommitMessageFormatterOptions {
  subjectLength?: number;
  lineLength?: number;
}

class CommitMessageFormatter {
  private _subjectLength: number;
  private _lineLength: number;

  constructor({
    subjectLength = 50,
    lineLength = 72,
  }: CommitMessageFormatterOptions) {
    this._subjectLength = subjectLength;
    this._lineLength = lineLength;
  }

  format(message: string): string {
    let pos = 0;
    let nextBreakPoint = this._subjectLength;
    const lines: string[] = [];

    while (pos < message.length) {
      lines.push(message.substring(pos, nextBreakPoint));
      pos = nextBreakPoint;
      nextBreakPoint = Math.min(
        nextBreakPoint + this._lineLength,
        message.length
      );
    }

    return lines.join('\n');
  }
}

export default CommitMessageFormatter;
