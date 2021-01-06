import {configureStore} from '@reduxjs/toolkit';
import {getAPI} from '../utils/VSCodeAPIService';
import {postMessageDispatcher} from './middlewares/postMessageDispatcher';
import {rootReducer} from './reducers';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postMessageDispatcher),
  devTools: process.env.NODE_ENV !== 'production',
});

const saveState = () => {
  const vscode = getAPI();
  const data = {...store.getState()}
  data.persisted = true;
  vscode.setState(data);
}

store.subscribe(saveState);

export default store;

export interface RootState {
  persisted: boolean;
  config: ExtensionConfig;
  scmInputBoxValue: string;
  recentCommits?: Commit[];
  recentCommitsLoading: boolean;
  textareaValue: string;
}
