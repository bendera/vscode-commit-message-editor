import {configureStore} from '@reduxjs/toolkit';
import {Commit} from '../@types/git';
import {postMessageSender} from './postMessageSender';
import {rootReducer} from './reducers';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postMessageSender),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

export interface RootState {
  config: ExtensionConfig;
  scmInputBoxValue: string;
  recentCommits: Commit[];
  recentCommitsLoading: boolean;
}
