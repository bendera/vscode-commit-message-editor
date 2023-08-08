import * as vscode from 'vscode';

export enum ViewType {
  PrimaryEditor = 'editCommitMessage',
  SecondaryEditor = 'secondaryEditorPanel',
  SettingsPage = 'cmeSettingsPage',
}

export enum Command {
  CopyFromScmInputBox = 'commitMessageEditor.copyFromSCMInputBox',
  LoadTemplate = 'commitMessageEditor.loadTemplate',
  OpenEditor = 'commitMessageEditor.openEditor',
  OpenSettings = 'commitMessageEditor.openSettingsPage',
}

export type ViewColumnKey =
  | 'Active'
  | 'Beside'
  | 'One'
  | 'Two'
  | 'Three'
  | 'Four'
  | 'Five'
  | 'Six'
  | 'Seven'
  | 'Eight'
  | 'Nine';

export type ViewColumnMap = Record<ViewColumnKey, number>;

export const editorGroupNameMap: ViewColumnMap = {
  Active: vscode.ViewColumn.Active,
  Beside: vscode.ViewColumn.Beside,
  One: vscode.ViewColumn.One,
  Two: vscode.ViewColumn.Two,
  Three: vscode.ViewColumn.Three,
  Four: vscode.ViewColumn.Four,
  Five: vscode.ViewColumn.Five,
  Six: vscode.ViewColumn.Six,
  Seven: vscode.ViewColumn.Seven,
  Eight: vscode.ViewColumn.Eight,
  Nine: vscode.ViewColumn.Nine,
};
