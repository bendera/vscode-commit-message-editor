import {Middleware} from '@reduxjs/toolkit';
import { RECENT_COMMITS_REQUEST } from './actions';
import {getAPI} from '../utils/VSCodeAPIService';

const vscode = getAPI();

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const postMessageSender: Middleware = (_) => (next) => (action) => {
  switch(action.type) {
    case RECENT_COMMITS_REQUEST:
      vscode.postMessage({
        command: 'requestRecentCommits',
      });
      break;
  }

  return next(action);
};
