import {createReducer} from '@reduxjs/toolkit';
import {RootState} from './store';
import {
  COPY_FROM_SCM_INPUTBOX,
  FORM_DATA_CHANGED,
  RECEIVE_CONFIG,
  RECENT_COMMITS_RECEIVED,
  RECENT_COMMITS_REQUEST,
  REPLACE_STATE,
  REPOSITORY_INFO_RECEIVED,
  TEXTAREA_VALUE_CHANGED,
} from './actions';

export const createInitialState = (): RootState => ({
  persisted: false,
  config: {
    confirmAmend: false,
    dynamicTemplate: [],
    staticTemplate: [],
    tokens: [],
    view: {
      defaultView: 'form',
      saveAndClose: false,
      showRecentCommits: false,
      visibleViews: 'both',
    },
  },
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
  [REPLACE_STATE]: (state: {[key: string]: unknown}, action) => {
    Object.keys(state).forEach((key) => {
      state[key] = action.payload[key];
    });
  },
  [FORM_DATA_CHANGED]: (state: RootState, action) => {
    const {payload} = action;
    const {name, value} = payload;
    state.tokenValues[name] = value;
  },
});
