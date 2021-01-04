import {Commit} from './@types/git';

declare global {
  type PostMessageCommand =
    | 'requestConfig'
    | 'closeTab'
    | 'requestRecentCommits'
    | 'confirmAmend'
    | 'copyFromExtensionMessageBox';

  interface PostMessageDO {
    command: PostMessageCommand;
    payload?: any;
  }

  type MessageEventCommand = 'copyFromSCMInputBox' | 'recentCommitMessages';

  interface MessageEventData {
    command: MessageEventCommand;
    payload?: any;
  }

  interface AppState {
    form?: {
      [name: string]: string;
    };
    messageBox?: string;
    commits?: Commit[];
    tabs?: number;
  }

  interface VSCodeAPI {
    postMessage: (message: PostMessageDO) => void;
    getState: () => AppState;
    setState: (state: AppState) => void;
  }

  function acquireVsCodeApi(): VSCodeAPI;
}
