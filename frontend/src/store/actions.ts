import {createAction} from '@reduxjs/toolkit';
import {RootState} from './store';

export const RECEIVE_CONFIG = 'RECEIVE_CONFIG';
export const RECENT_COMMITS_REQUEST = 'RECENT_COMMITS_REQUEST';
export const RECENT_COMMITS_RECEIVED = 'RECENT_COMMITS_RECEIVED';
export const COPY_FROM_SCM_INPUTBOX = 'COPY_FROM_SCM_INPUTBOX';
export const CLOSE_TAB = 'CLOSE_TAB';
export const TEXTAREA_VALUE_CHANGED = 'TEXTAREA_VALUE_CHANGED';
export const REPLACE_STATE = 'REPLACE_STATE';
export const CONFIRM_AMEND = 'CONFIRM_AMEND';
export const COPY_TO_SCM_INPUT_BOX = 'COPY_TO_SCM_INPUT_BOX';
export const FORM_DATA_CHANGED = 'FORM_DATA_CHANGED';
export const REPOSITORY_INFO_RECEIVED = 'REPOSITORY_INFO_RECEIVED';

export const receiveConfig = createAction<ExtensionConfig>(RECEIVE_CONFIG);
export const recentCommitsRequest = createAction(RECENT_COMMITS_REQUEST);
export const recentCommitsReceived = createAction<Commit[]>(
  RECENT_COMMITS_RECEIVED
);
export const copyFromSCMInputBox = createAction<string>(COPY_FROM_SCM_INPUTBOX);
export const closeTab = createAction(CLOSE_TAB);
export const textareaValueChanged = createAction<string>(
  TEXTAREA_VALUE_CHANGED
);
export const replaceState = createAction<RootState>(REPLACE_STATE);
export const confirmAmend = createAction<string>(CONFIRM_AMEND);
export const copyToSCMInputBox = createAction<string>(COPY_TO_SCM_INPUT_BOX);
export const formDataChanged = createAction<{[name: string]: string}>(
  FORM_DATA_CHANGED
);
export const receiveRepositoryInfo = createAction<RepositoryInfo>(REPOSITORY_INFO_RECEIVED);
