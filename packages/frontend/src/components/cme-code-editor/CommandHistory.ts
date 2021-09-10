export type CodeEditorHistoryType = 'keypress' | 'inputchange' | 'initializing';

export interface CodeEditorHistoryItem {
  type: CodeEditorHistoryType;
  value: string;
  caretPos: number;
}

export class CodeEditorHistory {
  private _length;
  private _history: CodeEditorHistoryItem[] = [];
  private _undoSteps = 0;

  constructor(length = 10) {
    this._length = length;
  }

  clear(): void {
    this._history = [];
  }

  add(item: CodeEditorHistoryItem): void {
    const {value, type, caretPos} = item;
    const l = this._history.length;

    if (this._undoSteps > 0) {
      this._history = this._history.slice(0, 0 - this._undoSteps);
      this._undoSteps = 0;
    }

    if (type === 'inputchange') {
      if (this._history[l - 1]?.type === 'inputchange') {
        this._history[l - 1].value = value;
        this._history[l - 1].caretPos = caretPos;
      } else {
        this._history.push({value, type, caretPos});
      }
    } else {
      this._history.push({value, type, caretPos});
    }

    if (this._history.length > this._length) {
      this._history.shift();
    }
  }

  undo(): CodeEditorHistoryItem | undefined {
    let item = undefined;
    const nextIndex = this._history.length - 2 - this._undoSteps;

    if (this._history[nextIndex]) {
      this._undoSteps++;
      item = this._history[nextIndex];
    }

    return item;
  }

  redo(): CodeEditorHistoryItem | undefined {
    let item = undefined;
    const nextIndex = this._history.length - this._undoSteps;

    if (this._history[nextIndex]) {
      this._undoSteps--;
      item = this._history[nextIndex];
    }

    return item;
  }
}
