export type CodeEditorHistoryType = 'keypress' | 'inputchange' | 'initializing';

export interface CodeEditorHistoryItem {
  type: CodeEditorHistoryType;
  value: string;
}

export class CodeEditorHistory {
  private _length;
  private _history: CodeEditorHistoryItem[] = [];

  constructor(length = 10) {
    this._length = length;
  }

  clear(): void {
    this._history = [];
  }

  add(item: CodeEditorHistoryItem): void {
    const {value, type} = item;
    const l = this._history.length;

    if (type === 'inputchange') {
      if (this._history[l - 1]?.type === 'inputchange') {
        this._history[l - 1].value = value;
      } else {
        this._history.push({value, type});
      }
    } else if (type === 'keypress') {
      this._history.push({value, type});
    }
  }

  prev(): CodeEditorHistoryItem | undefined {
    if (this._history.length === 0) {
      return;
    }

    if (this._history.length === 1) {
      return this._history[0];
    }

    return this._history.pop();
  }
}
