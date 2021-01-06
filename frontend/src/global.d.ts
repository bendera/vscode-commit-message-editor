import {RootState} from './store/store';

declare global {
  interface Commit {
    readonly hash: string;
    readonly message: string;
    readonly parents: string[];
    readonly authorDate: string;
    readonly authorName: string;
    readonly authorEmail?: string | undefined;
    commitDate: string;
  }

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

  interface VSCodeAPI {
    postMessage: (message: PostMessageDO) => void;
    getState: () => RootState;
    setState: (state: RootState) => void;
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
