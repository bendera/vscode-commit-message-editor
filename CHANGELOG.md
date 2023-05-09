# Change Log

All notable changes to the "commit-message-editor" extension will be documented in this file.

## [0.25.0] - 2023-05-09

### Fixed

- Deploy script had to be fixed. This version is identical to the 0.24.3.

## [0.24.3] - 2023-05-09

### Fixed

- Snycronize repository selector instances.

## [0.24.2] - 2023-05-08

### Fixed

- The form view didn't show if the repository didn't contain any commits. ([#94](https://github.com/bendera/vscode-commit-message-editor/issues/94))
- In some cases, the configuration was not applied at all on the editor tab.

### Added

- Change the cancel button style to secondary.
- Add the ability to change the repository from the tab in multi-root workspaces.

## [0.24.1] - 2023-04-17

### Fixed

- Show the correct repository on the new tab if it was opened from the scm view by clicking on the pencil icon.

## [0.24.0] - 2023-04-16

### Fixed

- In multi-root workspaces wrong repository names were shown in the selected repository block. (Fix [#68](https://github.com/bendera/vscode-commit-message-editor/issues/68))

### Changed

- Monospace editor styles are improved. 

## [0.23.1] - 2023-03-20

### Fixed

- Fix CSS overlay issue: focus border of the buttons in editor was clipped.

## [0.23.0] - 2023-03-06

### Added

- Add ability to use the monospace editor in the form view.
- Add ability to open the editor in a specific editor group.

## [0.22.1] - 2023-02-16

### Fixed

- The default view option was ignored when the form view was set as default. (Fix [#81](https://github.com/bendera/vscode-commit-message-editor/issues/81))
- The monospace editor was collapsed if the form view was the default view.

## [0.22.0] - 2023-02-16

### Fixed

- Added the missing value field to the boolean type (Fix [#79](https://github.com/bendera/vscode-commit-message-editor/issues/79))

### Changed

- VSCode Webview Elements updated to 0.8.1

## [0.21.1] - 2023-02-07

### Fixed

- Tabs view was broken on the editor page.

## [0.21.0] - 2023-02-06

### Added

- Added `Reduce Empty Lines` option. In previous versions, the unnecessary empty lines were removed
  automatically in the compiled message of the form view. However in many cases, this is an unwanted
  feature, so from this version the removal of empty lines is optional. It is allowed by default.

## [0.20.0] - 2023-01-30

### Added

- Allow adding newlines to the prefix, suffix and the separator

### Changed

- Where more than two empty lines followed each other, the "redundant" lines
  were removed automatically. It is an unsolicited feature, so it was deleted.

## [0.19.2] - 2021-12-19

- Fix [#47](https://github.com/bendera/vscode-commit-message-editor/issues/47)

## [0.19.1] - 2021-10-03

- Fix [#44](https://github.com/bendera/vscode-commit-message-editor/issues/44)
- Fix [#45](https://github.com/bendera/vscode-commit-message-editor/issues/45)

## [0.19.0] - 2021-09-10

## Added

- Shareable configuration
- Added maxLength property to the text tokens

## [0.18.4] - 2021-08-14

- Fix [#40](https://github.com/bendera/vscode-commit-message-editor/issues/40)

## [0.18.3] - 2021-08-07

- Fix [#38](https://github.com/bendera/vscode-commit-message-editor/issues/38)

## [0.18.2] - 2021-08-04

- VSCode Webview Elements updated to 0.6.2
- Full width mode fixed when only one view is visible

## [0.18.0] - 2021-05-08

- Added full-width mode: the content fills the whole available space.
- Monospace editor: optional editor in the text view which uses a monospace font

## [0.17.0] - 2021-04-10

- `combobox` option added to the enum type token
- Added "Select all/Deselect all" buttons to the multi-select widget
- Tab content won't be destroyed when the active tab is changed

## [0.16.3] - 2021-03-16

- Fix option hover color (again)

## [0.16.2] - 2021-03-08

- Fix option hover color

## [0.16.1] - 2021-03-01

- The recent commit list will be updated when the selected repo is changed

## [0.16.0] - 2021-02-28

### Features

- Configurable textarea height in the form view
- The selected repository name will be displayed above the buttons if more than one repo is available

### Fix

- Description was not displayed in the multi-select widget

## [0.15.3] - 2021-02-05

- Fix [#26](https://github.com/bendera/vscode-commit-message-editor/issues/26)

## [0.15.2] - 2021-01-28

- Fix [#25](https://github.com/bendera/vscode-commit-message-editor/issues/25)

## [0.15.1] - 2021-01-27

- Github Actions fix

## [0.15.0] - 2021-01-27

- The frontend has been completely rewritten from scratch
- Added `multiple` option to the enum type

## [0.14.4] - 2020-11-07

- Fix [#18](https://github.com/bendera/vscode-commit-message-editor/issues/18) 

## [0.14.3] - 2020-10-29

- The default config follows the Conventional Commits format
- Uses built-in icons in the menu header

## [0.14.0] - 2020-10-15

- Add ability to disable form or textarea view

## [0.13.2] - 2020-10-09

- Fix [#12](https://github.com/bendera/vscode-commit-message-editor/issues/12) 

## [0.13.1] - 2020-10-09

- Fix typo in the default config
- Update documentation

## [0.13.0] - 2020-06-08

- Add "save and close" option
- Minor changes

## [0.12.3] - 2020-05-16

- Fix [#5](https://github.com/bendera/vscode-commit-message-editor/issues/5)

## [0.12.2] - 2020-01-08

- Fix the buggy select in the form view

## [0.12.1] - 2020-01-06

- Uncheck "Amend previous commit" checkbox when the last commit reverted

## [0.12.0] - 2020-01-05

- Add ability to amend commit
- Add `commit-message-editor.confirmAmend` configuration option

## [0.10.0] - 2019-11-09

- Configurable default view (textfield or form), add `commit-message-editor.defaultView` config option
- Content Security Policy fine tuning
- CSS improvements

## [0.9.2] - 2019-11-07

- Save view state between tab switches

## [0.9.1] - 

- Add VSCode Webview Elements as npm dependency

## [0.9.0] - 

- Add ability to edit commit message in a customizable form
- Add ability to use token variables in the template
- Add `commit-message-editor.tokens` configuration option to define the available tokens

## [0.1.2] - 2019-10-18
## [0.1.1] - 2019-10-18

- Not too much, familiarize myself with the VSCode publishing tool :D

## [0.1.0] - 2019-10-18

### Initial release, implement the basic functionality

- Add ability to define commit message template in the configuration (`commit-message-editor.template`)
- Add webview with a textarea and a list of recent commits
- Add a pencil icon to the VSCode source control view that opens the editor in a new tab
