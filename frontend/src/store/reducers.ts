import {createReducer} from '@reduxjs/toolkit';
import {RootState} from './store';
import {
  COPY_FROM_SCM_INPUTBOX,
  RECEIVE_CONFIG,
  RECENT_COMMITS_RECEIVED,
  RECENT_COMMITS_REQUEST,
  REPOSITORY_INFO_RECEIVED,
  SHAREABLE_CONFIG_CHANGED,
  SHAREABLE_CONFIG_TOKEN_CHANGED,
  SHAREABLE_CONFIG_TOKEN_DELETE,
  SHAREABLE_CONFIG_TOKEN_ADD,
  SHAREABLE_CONFIG_STATIC_TEMPLATE_CHANGE,
  SHAREABLE_CONFIG_DYNAMIC_TEMPLATE_CHANGE,
  TEXTAREA_VALUE_CHANGED,
  UPDATE_TOKEN_VALUES,
  CHANGE_STATUS_MESSAGE,
} from './actions';

export const createInitialState = (): RootState => ({
  config: {
    confirmAmend: false,
    dynamicTemplate: [],
    staticTemplate: [],
    tokens: [],
    view: {
      defaultView: 'form',
      fullWidth: false,
      saveAndClose: false,
      showRecentCommits: false,
      visibleViews: 'both',
      visibleLines: 10,
      rulers: [],
      useMonospaceEditor: false,
      tabSize: 4,
      useTabs: false,
    },
  },
  shareableConfig: {
    dynamicTemplate: [],
    staticTemplate: [],
    tokens: [],
  },
  importError: false,
  importErrorMessage: '',
  statusMessage: '',
  statusMessageType: 'invisible',
  scmInputBoxValue: '',
  recentCommits: undefined,
  recentCommitsLoading: false,
  textareaValue: '',
  tokenValues: {},
  numberOfRepositories: 0,
  selectedRepositoryPath: '',
});

const initialState = createInitialState();

export const rootReducer = createReducer(initialState, {
  [RECEIVE_CONFIG]: (state: RootState, action) => {
    state.config = action.payload;
  },
  [RECENT_COMMITS_REQUEST]: (state: RootState) => {
    state.recentCommitsLoading = true;
  },
  [RECENT_COMMITS_RECEIVED]: (state: RootState, action) => {
    state.recentCommits = action.payload;
    state.recentCommitsLoading = false;
  },
  [REPOSITORY_INFO_RECEIVED]: (state: RootState, action) => {
    const {numberOfRepositories, selectedRepositoryPath} = action.payload;

    state.numberOfRepositories = numberOfRepositories;
    state.selectedRepositoryPath = selectedRepositoryPath;
  },
  [COPY_FROM_SCM_INPUTBOX]: (state: RootState, action) => {
    const {payload} = action;

    if (action.payload !== '' && state.textareaValue === '') {
      state.textareaValue = payload;
    }
  },
  [TEXTAREA_VALUE_CHANGED]: (state: RootState, action) => {
    state.textareaValue = action.payload;
  },
  [UPDATE_TOKEN_VALUES]: (state: RootState, action) => {
    const {payload} = action;
    state.tokenValues = payload;
  },
  [SHAREABLE_CONFIG_CHANGED]: (state: RootState, action) => {
    const {payload} = action;
    const {staticTemplate = '', dynamicTemplate = '', tokens = []} = payload;

    state.shareableConfig = {staticTemplate, dynamicTemplate, tokens};
    state.importError = false;
    state.importErrorMessage = '';
  },
  [SHAREABLE_CONFIG_TOKEN_CHANGED]: (state: RootState, action) => {
    const {index, data} = action.payload;

    state.shareableConfig.tokens = state.shareableConfig.tokens.map((t, i) => {
      if (i === index) {
        return data;
      }

      return t;
    });
  },
  [SHAREABLE_CONFIG_TOKEN_DELETE]: (state: RootState, action) => {
    const {index} = action.payload;

    state.shareableConfig.tokens = state.shareableConfig.tokens.filter(
      (_t, i) => i !== index
    );
  },
  [SHAREABLE_CONFIG_TOKEN_ADD]: (state: RootState, action) => {
    state.shareableConfig.tokens.push(action.payload);
  },
  [SHAREABLE_CONFIG_STATIC_TEMPLATE_CHANGE]: (state: RootState, action) => {
    state.shareableConfig.staticTemplate = action.payload.split('\n');
  },
  [SHAREABLE_CONFIG_DYNAMIC_TEMPLATE_CHANGE]: (state: RootState, action) => {
    state.shareableConfig.dynamicTemplate = action.payload.split('\n');
  },
  [CHANGE_STATUS_MESSAGE]: (state: RootState, action) => {
    const {statusMessage, statusMessageType} = action.payload;
    state.statusMessage = statusMessage;
    state.statusMessageType = statusMessageType;
  }
});
