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

export const getCurrentLine = (
  el: HTMLTextAreaElement,
  newlinePosList: number[]
): number => {
  const {selectionStart, selectionEnd} = el;

  if (selectionStart !== selectionEnd) {
    return -1;
  }

  const caretPos = selectionStart;

  if (newlinePosList.length === 0) {
    return 0;
  }

  if (caretPos > newlinePosList[newlinePosList.length - 1]) {
    return newlinePosList.length;
  }

  return newlinePosList.findIndex((nlPos, index, arr) => {
    if (index === 0) {
      return caretPos >= 0 && caretPos <= nlPos;
    } else {
      return caretPos > arr[index - 1] && caretPos <= nlPos;
    }
  });
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

export const getLongestLineLength = (el: HTMLTextAreaElement): number => {
  return el.value.split('\n').reduce((acc, curr) => {
    if (curr.length > acc) {
      return curr.length;
    }

    return acc;
  }, 0);
};

export const insertTab = (
  el: HTMLTextAreaElement,
  useTab = true,
  tabSize = 2
): void => {
  const {
    selectionStart,
    textBeforeSelection,
    textAfterSelection,
  } = getSelectionInfo(el);
  const tab = useTab ? '\t' : ''.padEnd(tabSize, ' ');

  el.value = textBeforeSelection + tab + textAfterSelection;
  el.selectionStart = el.selectionEnd = selectionStart + tab.length;
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

  if (!indent) {
    el.value = newValueWithoutIndentation;
    el.selectionStart = el.selectionEnd = selectionStart + 1;
  } else {
    const selectionSize = selectionEnd - selectionStart;
    const appendedNewlinePos = selectionEnd - selectionSize;
    const newlinePosList = getNewlinePosList(newValueWithoutIndentation);
    const lines = newValueWithoutIndentation.split('\n');
    const prevLineIndex = binarySearch(newlinePosList, appendedNewlinePos);
    const matches = /^\s+/g.exec(lines[prevLineIndex]);
    const prevLineIndenation = matches ? matches[0] : '';

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
