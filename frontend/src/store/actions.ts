import {createAction} from '@reduxjs/toolkit';
import {
  Commit,
  ExtensionConfig,
  RepositoryInfo,
  ShareableConfig,
  Token,
} from '../definitions';

export const RECEIVE_CONFIG = 'RECEIVE_CONFIG';
export const RECENT_COMMITS_REQUEST = 'RECENT_COMMITS_REQUEST';
export const RECENT_COMMITS_RECEIVED = 'RECENT_COMMITS_RECEIVED';
export const COPY_FROM_SCM_INPUTBOX = 'COPY_FROM_SCM_INPUTBOX';
export const CLOSE_TAB = 'CLOSE_TAB';
export const TEXTAREA_VALUE_CHANGED = 'TEXTAREA_VALUE_CHANGED';
export const CONFIRM_AMEND = 'CONFIRM_AMEND';
export const COPY_TO_SCM_INPUT_BOX = 'COPY_TO_SCM_INPUT_BOX';
export const REPOSITORY_INFO_RECEIVED = 'REPOSITORY_INFO_RECEIVED';
export const UPDATE_TOKEN_VALUES = 'UPDATE_TOKEN_VALUES';
export const CHANGE_SELECTED_REPOSITORY = 'CHANGE_SELECTED_REPOSITORY';

export const IMPORT_CONFIG = 'IMPORT_CONFIG';
export const SHAREABLE_CONFIG_CHANGED = 'SHAREABLE_CONFIG_CHANGED';
export const SHAREABLE_CONFIG_TOKEN_CHANGED = 'SHAREABLE_CONFIG_TOKEN_CHANGED';
export const SHAREABLE_CONFIG_TOKEN_ADD = 'SHAREABLE_CONFIG_TOKEN_ADD';
export const SHAREABLE_CONFIG_TOKEN_DELETE = 'SHAREABLE_CONFIG_TOKEN_DELETE';
export const LOAD_CURRENT_CONFIG = 'LOAD_CURRENT_CONFIG';
export const SHAREABLE_CONFIG_STATIC_TEMPLATE_CHANGE =
  'SHAREABLE_CONFIG_STATIC_TEMPLATE_CHANGE';
export const SHAREABLE_CONFIG_DYNAMIC_TEMPLATE_CHANGE =
  'SHAREABLE_CONFIG_DYNAMIC_TEMPLATE_CHANGE';
export const CHANGE_STATUS_MESSAGE = 'CHANGE_STATUS_MESSAGE';

export const receiveConfig = createAction<ExtensionConfig>(RECEIVE_CONFIG);
export const recentCommitsRequest = createAction<string | undefined>(
  RECENT_COMMITS_REQUEST
);
export const recentCommitsReceived = createAction<Commit[]>(
  RECENT_COMMITS_RECEIVED
);
export const copyFromSCMInputBox = createAction<string>(COPY_FROM_SCM_INPUTBOX);
export const closeTab = createAction(CLOSE_TAB);
export const textareaValueChanged = createAction<string>(
  TEXTAREA_VALUE_CHANGED
);
export const confirmAmend = createAction<string>(CONFIRM_AMEND);
export const copyToSCMInputBox = createAction<{
  commitMessage: string;
  selectedRepositoryPath: string;
}>(COPY_TO_SCM_INPUT_BOX);
export const receiveRepositoryInfo = createAction<RepositoryInfo>(
  REPOSITORY_INFO_RECEIVED
);
export const updateTokenValues = createAction<{[key: string]: string}>(
  UPDATE_TOKEN_VALUES
);
export const changeSelectedRepository = createAction<string>(
  CHANGE_SELECTED_REPOSITORY
);

export const importConfig = createAction(IMPORT_CONFIG);
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
export const loadCurrentConfig = createAction<{
  staticTemplate: string;
  dynamicTemplate: string;
  tokens: Token[];
}>(LOAD_CURRENT_CONFIG);
export const staticTemplateChange = createAction<string>(
  SHAREABLE_CONFIG_STATIC_TEMPLATE_CHANGE
);
export const dynamicTemplateChange = createAction<string>(
  SHAREABLE_CONFIG_DYNAMIC_TEMPLATE_CHANGE
);
export const changeStatusMessage = createAction<{
  statusMessage: string;
  statusMessageType: 'error' | 'success' | 'invisible';
}>(CHANGE_STATUS_MESSAGE);
