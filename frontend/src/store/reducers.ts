import {createReducer} from '@reduxjs/toolkit';
import {RootState} from './store';
import {
  COPY_FROM_SCM_INPUTBOX,
  RECEIVE_CONFIG,
  RECENT_COMMITS_RECEIVED,
  RECENT_COMMITS_REQUEST,
  REPLACE_STATE,
  TEXTAREA_VALUE_CHANGED,
} from './actions';

const initialState: RootState = {
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
};

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
});
