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
