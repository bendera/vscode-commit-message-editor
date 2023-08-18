type TokenType = 'text' | 'boolean' | 'enum';
type DefaultViewConfig = 'text' | 'form';
type VisibleViewsConfig = 'text' | 'form' | 'both';

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

export interface ExtensionConfiguration {
  confirmAmend: boolean;
  dynamicTemplate: string[];
  staticTemplate: string[];
  tokens: Token[];
  reduceEmptyLines: boolean;
  inputValidationLength: number;
  inputValidationSubjectLength: number;
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

export const COPY_FROM_EXTENSION_MESSAGE_BOX = 'copyFromExtensionMessageBox';
export const CLOSE_TAB = 'closeTab';
export const REQUEST_CONFIG = 'requestConfig';
export const REQUEST_RECENT_COMMITS = 'requestRecentCommits';
export const CONFIRM_AMEND = 'confirmAmend';
export const OPEN_CONFIGURATION_PAGE = 'openConfigurationPage';

export interface CopyFromExtensionMessageBoxPM {
  command: typeof COPY_FROM_EXTENSION_MESSAGE_BOX;
  payload: {
    commitMessage: string;
    selectedRepositoryPath: string;
  };
}

export interface CloseTabPM {
  command: typeof CLOSE_TAB;
}

export interface RequestConfigPM {
  command: typeof REQUEST_CONFIG;
}

export interface RequestRecentCommitsPM {
  command: typeof REQUEST_RECENT_COMMITS;
  payload: string;
}

export interface ConfirmAmendPM {
  command: typeof CONFIRM_AMEND;
  payload: string;
}

export interface OpenConfigurationPagePM {
  command: typeof OPEN_CONFIGURATION_PAGE;
}

export type ExtensionPostMessage =
  | CopyFromExtensionMessageBoxPM
  | CloseTabPM
  | RequestConfigPM
  | RequestRecentCommitsPM
  | ConfirmAmendPM
  | OpenConfigurationPagePM;
