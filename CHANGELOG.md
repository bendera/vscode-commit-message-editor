# Change Log

All notable changes to the "commit-message-editor" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

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
