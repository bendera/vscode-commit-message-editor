import * as vscode from 'vscode';

interface EnumTypeOption {
  label: string;
  description?: string;
  value?: string;
}

interface Token {
  label: string;
  name: string;
  description?: string;
  type: 'enum' | 'text' | 'boolean';
  multiline?: boolean;
  prefix?: string;
  suffix?: string;
  options?: EnumTypeOption[];
}

interface ExtensionConfig {
  dynamicTemplate: string[] | undefined;
  staticTemplate: string[] | undefined;
  tokens: Token[] | undefined;
  showRecentCommits: boolean;
  saveAndClose: boolean;
}

const getExtensionConfig = () => {
  return {
    staticTemplate: vscode.workspace
      .getConfiguration('commit-message-editor')
      .get('staticTemplate'),
    dynamicTemplate: vscode.workspace
      .getConfiguration('commit-message-editor')
      .get('dynamicTemplate'),
    tokens: vscode.workspace
      .getConfiguration('commit-message-editor')
      .get('tokens'),
    showRecentCommits: !!vscode.workspace
      .getConfiguration('commit-message-editor.view')
      .get('showRecentCommits'),
    saveAndClose: !!vscode.workspace
      .getConfiguration('commit-message-editor.view')
      .get('saveAndClose'),
  };
};

export default getExtensionConfig;
