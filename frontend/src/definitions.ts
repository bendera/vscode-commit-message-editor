import {RootState} from './store/store';

export interface Commit {
  readonly hash: string;
  readonly message: string;
  readonly parents: string[];
  readonly authorDate: string;
  readonly authorName: string;
  readonly authorEmail?: string | undefined;
  commitDate: string;
}

export type PostMessageCommand =
  | 'requestConfig'
  | 'closeTab'
  | 'requestRecentCommits'
  | 'confirmAmend'
  | 'copyFromExtensionMessageBox'
  | 'importConfig'
  | 'exportConfig'
  | 'loadCurrentConfig'
  | 'saveToSettings'
  | 'openConfigurationPage';

export interface PostMessageDO {
  command: PostMessageCommand;
  payload?: unknown;
}

export type MessageEventCommand =
  | 'amendPerformed'
  | 'copyFromSCMInputBox'
  | 'recentCommitMessages'
  | 'receiveConfig'
  | 'repositoryInfo'
  | 'receiveImportedConfig'
  | 'statusMessage'
  | 'loadCurrentConfig';

export interface ReceivedMessageDO {
  command: MessageEventCommand;
  payload?: unknown;
}

export interface VSCodeAPI {
  postMessage: (message: PostMessageDO) => void;
  getState: () => RootState;
  setState: (state: RootState) => void;
}

export type TokenType = 'text' | 'boolean' | 'enum';

export interface EnumTokenOption {
  label: string;
  value?: string;
  description?: string;
}

export interface Token {
  label: string;
  name: string;
  type: TokenType;
  value?: string;
  options?: EnumTokenOption[];
  description?: string;
  multiline?: boolean;
  monospace?: boolean;
  combobox?: boolean;
  filter?: string;
  lines?: number;
  maxLines?: number;
  maxLength?: number;
  maxLineLength?: number;
  multiple?: boolean;
  separator?: string;
  prefix?: string;
  suffix?: string;
}

export type DefaultViewConfig = 'text' | 'form';
export type VisibleViewsConfig = 'text' | 'form' | 'both';

export interface ExtensionConfig {
  confirmAmend: boolean;
  dynamicTemplate: string[];
  staticTemplate: string[];
  tokens: Token[];
  reduceEmptyLines: boolean;
  view: {
    defaultView: DefaultViewConfig;
    visibleViews: VisibleViewsConfig;
    showRecentCommits: boolean;
    saveAndClose: boolean;
    fullWidth: boolean;
    useMonospaceEditor: boolean;
    tabSize: number;
    useTabs: boolean;
    rulers: number[];
    visibleLines: number;
  };
}

export type ShareableConfig = Pick<
  ExtensionConfig,
  'dynamicTemplate' | 'staticTemplate' | 'tokens'
>;

export interface RepositoryInfo {
  numberOfRepositories: number;
  selectedRepositoryPath: string;
  availableRepositories: string[];
}
