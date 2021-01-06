import {Middleware} from '@reduxjs/toolkit';
import {
  CLOSE_TAB,
  CONFIRM_AMEND,
  COPY_TO_SCM_INPUT_BOX,
  RECENT_COMMITS_REQUEST,
} from '../actions';
import {getAPI} from '../../utils/VSCodeAPIService';

const vscode = getAPI();

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const postMessageDispatcher: Middleware = (_) => (next) => (action) => {
  const {payload} = action;

  switch (action.type) {
    case RECENT_COMMITS_REQUEST:
      vscode.postMessage({
        command: 'requestRecentCommits',
      });
      break;
    case CLOSE_TAB:
      vscode.postMessage({
        command: 'closeTab',
      });
      break;
    case COPY_TO_SCM_INPUT_BOX:
      vscode.postMessage({
        command: 'copyFromExtensionMessageBox',
        payload,
      });
      break;
    case CONFIRM_AMEND:
      vscode.postMessage({
        command: 'confirmAmend',
      });
      break;
  }

  return next(action);
};
