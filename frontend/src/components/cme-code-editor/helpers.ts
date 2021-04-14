import binarySearch from '../../utils/binarySearch';

export const getNewlinePosList = (text: string): number[] => {
  const res = [];
  let from = 0;
  let found = -2;

  while (found !== -1) {
    found = text.indexOf('\n', from);

    if (found > -1) {
      from = found + 1;
      res.push(found);
    }
  }

  return res;
};

const getSelectionInfo = (
  el: HTMLTextAreaElement
): {
  textBeforeSelection: string;
  textAfterSelection: string;
  selectionStart: number;
  selectionEnd: number;
} => {
  const {selectionStart, selectionEnd} = el;
  const textBeforeSelection = el.value.substring(0, selectionStart);
  const textAfterSelection = el.value.substring(selectionEnd, el.value.length);

  return {
    textBeforeSelection,
    textAfterSelection,
    selectionStart,
    selectionEnd,
  };
};

export const insertTab = (el: HTMLTextAreaElement): void => {
  const {
    selectionStart,
    textBeforeSelection,
    textAfterSelection,
  } = getSelectionInfo(el);

  el.value = textBeforeSelection + '\t' + textAfterSelection;
  el.selectionStart = el.selectionEnd = selectionStart + 1;
};

export const insertNewline = (el: HTMLTextAreaElement, indent = true): void => {
  const {
    selectionStart,
    selectionEnd,
    textBeforeSelection,
    textAfterSelection,
  } = getSelectionInfo(el);
  const newValueWithoutIndentation =
    textBeforeSelection + '\n' + textAfterSelection;
  const appendedNewlinePos = selectionEnd;
  const newlinePosList = getNewlinePosList(newValueWithoutIndentation);
  const lines = newValueWithoutIndentation.split('\n');
  const prevLineIndex = binarySearch(newlinePosList, appendedNewlinePos);
  const matches = /^\s+/g.exec(lines[prevLineIndex]);
  const prevLineIndenation = matches ? matches[0] : '';

  if (!indent) {
    el.value = newValueWithoutIndentation;
    el.selectionStart = el.selectionEnd = selectionStart + 1;
  } else {
    lines[prevLineIndex + 1] = prevLineIndenation + lines[prevLineIndex + 1];
    let caretPos = 0;

    lines.forEach((line, index) => {
      if (index <= prevLineIndex) {
        caretPos += line.length + 1;
      }
    });

    el.value = lines.join('\n');
    el.selectionStart = el.selectionEnd = caretPos + prevLineIndenation.length;
  }
};
