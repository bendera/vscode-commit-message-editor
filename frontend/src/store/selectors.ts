import {RootState} from './store';

export const confirmAmendSelector = (state: RootState): boolean =>
  state.config.confirmAmend;
