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

  type MessageEventCommand =
    | 'amendPerformed'
    | 'copyFromSCMInputBox'
    | 'recentCommitMessages'
    | 'receiveConfig';

  interface ReceivedMessageDO {
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

  type TokenType = 'text' | 'boolean' | 'enum';

  interface Token {
    label: string;
    name: string;
  }

  interface ExtensionConfig {
    confirmAmend: boolean;
    dynamicTemplate: string[];
    staticTemplate: string[];
    tokens: Token[];
    view: {
      defaultView: 'text' | 'form';
      visibleViews: 'text' | 'form' | 'both';
      showRecentCommits: boolean;
      saveAndClose: boolean;
    };
  }

  function acquireVsCodeApi(): VSCodeAPI;
}
