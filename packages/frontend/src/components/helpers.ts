import {VscodeInputbox} from '@bendera/vscode-webview-elements/dist/vscode-inputbox';

export const triggerInputboxRerender = (
  inputs: NodeListOf<VscodeInputbox>
): void => {
  Array.from(inputs).forEach((el) => {
    const oVal = el.value;
    el.value = oVal === '' ? ' ' : '';
    el.value = oVal;
  });
};
