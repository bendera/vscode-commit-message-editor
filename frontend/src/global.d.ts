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
    | 'receiveConfig'
    | 'repositoryInfo';

  interface ReceivedMessageDO {
    command: MessageEventCommand;
    payload?: unknown;
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
    type: TokenType;
    value?: string;
    options?: {
      label: string;
      value?: string;
      description?: string;
    }[];
    description?: string;
    multiline?: boolean;
    combobox?: boolean;
    lines?: number;
    maxLines?: number;
    multiple?: boolean;
    separator?: string;
    prefix?: '';
    suffix?: '';
  }

  type DefaultViewConfig = 'text' | 'form';
  type VisibleViewsConfig = 'text' | 'form' | 'both';

  interface ExtensionConfig {
    confirmAmend: boolean;
    dynamicTemplate: string[];
    staticTemplate: string[];
    tokens: Token[];
    view: {
      defaultView: DefaultViewConfig;
      visibleViews: VisibleViewsConfig;
      showRecentCommits: boolean;
      saveAndClose: boolean;
      fullWidth: boolean;
    };
  }

  interface RepositoryInfo {
    numberOfRepositories: number;
    selectedRepositoryPath: string;
  }

  function acquireVsCodeApi(): VSCodeAPI;
}
