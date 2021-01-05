import {createAction} from '@reduxjs/toolkit';
import { Commit } from '../@types/git';

export const RECEIVE_CONFIG = 'RECEIVE_CONFIG';
export const RECENT_COMMITS_REQUEST = 'RECENT_COMMITS_REQUEST';
export const RECENT_COMMITS_RECEIVED = 'RECENT_COMMITS_RECEIVED';
export const COPY_FROM_SCM_INPUTBOX = 'COPY_FROM_SCM_INPUTBOX';

export const receiveConfig = createAction<ExtensionConfig>(RECEIVE_CONFIG);
export const recentCommitsRequest = createAction(RECENT_COMMITS_REQUEST);
export const recentCommitsReceived = createAction<Commit[]>(RECENT_COMMITS_RECEIVED);
export const copyFromSCMInputBox = createAction<string>(COPY_FROM_SCM_INPUTBOX);
