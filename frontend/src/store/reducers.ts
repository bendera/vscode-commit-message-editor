import {createReducer} from '@reduxjs/toolkit';
import {RootState} from './store';
import {COPY_FROM_SCM_INPUTBOX, RECEIVE_CONFIG} from './actions';

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
};

export const rootReducer = createReducer(initialState, {
  [RECEIVE_CONFIG]: (state: RootState, action) => {
    state.config = action.payload;
  },
  [COPY_FROM_SCM_INPUTBOX]: (state: RootState, action) => {
    state.scmInputBoxValue = action.payload;
  },
});
