# Change Log

All notable changes to the "commit-message-editor" extension will be documented in this file.

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
