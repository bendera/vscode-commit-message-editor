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
export const REPOSITORY_INFO_RECEIVED = 'REPOSITORY_INFO_RECEIVED';
export const UPDATE_TOKEN_VALUES = 'UPDATE_TOKEN_VALUES';

export const IMPORT_CONFIG = 'IMPORT_CONFIG';
export const SHAREABLE_CONFIG_IMPORT_ERROR = 'SHAREABLE_CONFIG_IMPORT_ERROR';
export const SHAREABLE_CONFIG_CHANGED = 'SHAREABLE_CONFIG_CHANGED';
export const SHAREABLE_CONFIG_TOKEN_CHANGED = 'SHAREABLE_CONFIG_TOKEN_CHANGED';
export const SHAREABLE_CONFIG_TOKEN_ADD = 'SHAREABLE_CONFIG_TOKEN_ADD';
export const SHAREABLE_CONFIG_TOKEN_DELETE = 'SHAREABLE_CONFIG_TOKEN_DELETE';

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
export const receiveRepositoryInfo = createAction<RepositoryInfo>(
  REPOSITORY_INFO_RECEIVED
);
export const updateTokenValues =
  createAction<{[key: string]: string}>(UPDATE_TOKEN_VALUES);

export const importConfig = createAction(IMPORT_CONFIG);
export const shareableConfigImportError = createAction<{errorMessage: string}>(
  SHAREABLE_CONFIG_IMPORT_ERROR
);
export const shareableConfigChange = createAction<ShareableConfig>(
  SHAREABLE_CONFIG_CHANGED
);
export const shareableConfigTokenChange = createAction<{
  index: number;
  data: Token;
}>(SHAREABLE_CONFIG_TOKEN_CHANGED);
export const shareableConfigTokenDelete = createAction<{index: number}>(
  SHAREABLE_CONFIG_TOKEN_DELETE
);
export const shareableConfigTokenAdd = createAction<Token>(
  SHAREABLE_CONFIG_TOKEN_ADD
);
