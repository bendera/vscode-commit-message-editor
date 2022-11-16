import {RootState} from './store/store';
import { SubjectFormattingMode } from './utils/CommitMessageFormatter';

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
    | 'copyFromExtensionMessageBox'
    | 'importConfig'
    | 'exportConfig'
    | 'loadCurrentConfig'
    | 'saveToSettings'
    | 'openConfigurationPage';

  interface PostMessageDO {
    command: PostMessageCommand;
    payload?: any;
  }

  type MessageEventCommand =
    | 'amendPerformed'
    | 'copyFromSCMInputBox'
    | 'recentCommitMessages'
    | 'receiveConfig'
    | 'repositoryInfo'
    | 'receiveImportedConfig'
    | 'statusMessage'
    | 'loadCurrentConfig';

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

  interface EnumTokenOption {
    label: string;
    value?: string;
    description?: string;
  }

  interface Token {
    label: string;
    name: string;
    type: TokenType;
    value?: string;
    options?: EnumTokenOption[];
    description?: string;
    multiline?: boolean;
    combobox?: boolean;
    filter?: string;
    lines?: number;
    maxLines?: number;
    maxLength?: number;
    multiple?: boolean;
    separator?: string;
    prefix?: string;
    suffix?: string;
  }

  type DefaultViewConfig = 'text' | 'form';
  type VisibleViewsConfig = 'text' | 'form' | 'both';

  interface ExtensionConfig {
    'commit-message-editor': {
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
        useMonospaceEditor: boolean;
        visibleLines: number;
      };
      formatting: {
        tabSize: number;
        useTabs: boolean;
        subjectFormattingMode: SubjectFormattingMode;
        blankLineAfterSubject: boolean;
      };
    };
    git: {
      inputValidationLength: number;
      inputValidationSubjectLength: number;
    };
  }

  type ShareableConfig = Pick<
    ExtensionConfig['commit-message-editor'],
    'dynamicTemplate' | 'staticTemplate' | 'tokens'
  >;

  interface RepositoryInfo {
    numberOfRepositories: number;
    selectedRepositoryPath: string;
  }

  function acquireVsCodeApi(): VSCodeAPI;
}
