import {createReducer} from '@reduxjs/toolkit';
import {RootState} from './store';
import {COPY_FROM_SCM_INPUTBOX, RECEIVE_CONFIG, RECENT_COMMITS_RECEIVED} from './actions';

const initialState: RootState = {
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
  recentCommits: [],
  recentCommitsLoading: false,
};

export const rootReducer = createReducer(initialState, {
  [RECEIVE_CONFIG]: (state: RootState, action) => {
    state.config = action.payload;
  },
  [RECENT_COMMITS_RECEIVED]: (state: RootState, action) => {
    state.recentCommits = action.payload;
    state.recentCommitsLoading = false;
  },
  [COPY_FROM_SCM_INPUTBOX]: (state: RootState, action) => {
    state.scmInputBoxValue = action.payload;
  },
});
