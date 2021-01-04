import {createAction} from '@reduxjs/toolkit';

export const RECEIVE_CONFIG = 'RECEIVE_CONFIG';
export const COPY_FROM_SCM_INPUTBOX = 'COPY_FROM_SCM_INPUTBOX';

export const receiveConfig = createAction<ExtensionConfig>(RECEIVE_CONFIG);
export const copyFromSCMInputBox = createAction<string>(COPY_FROM_SCM_INPUTBOX);
