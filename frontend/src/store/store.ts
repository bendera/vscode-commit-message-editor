import {configureStore} from '@reduxjs/toolkit';
import {rootReducer} from './reducers';

const store = configureStore({reducer: rootReducer});

export default store;

export interface RootState {
  config: ExtensionConfig;
  scmInputBoxValue: string;
}
