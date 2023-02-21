# Commit Message Editor

Edit commit messages in a convenient way.

## Highlighs

- Commit messages can be editable in a customizable form. This helps you to use a standardized format.
- Portable configuration to share settings with teammates.
- A huge textarea on a dedicated tab.
- Clean look, thanks to [Vscode Webview Elements](https://github.com/bendera/vscode-webview-elements)

![Preview](preview1.gif)

The factory settings follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

![Preview](preview2.gif)

### More screenshots

- [Configuration editor](https://bendera.github.io/vscode-commit-message-editor/screenshots/configuration-editor.png)
- [Regular textarea](https://bendera.github.io/vscode-commit-message-editor/screenshots/regular-text-editor.png)
- [Monospace textarea](https://bendera.github.io/vscode-commit-message-editor/screenshots/monospace-text-editor.png)

## Customizing the commit message form

The easiest way to customizing the commit message form is to use the
Configuration Editor. To open the configuration editor, choose the
`Commit Message Editor: Open Settings Page` command from the Command Palette, or
click on the gear icon in the top right corner of the Commit Message Editor tab.
Here, you can export the current configuration or import another one. The loaded
configuration can be saved to the user or the workspace settings.

A JSON schema is created for the portable configuration file format. This means,
you can use the [VSCode toolset](https://code.visualstudio.com/docs/languages/json)
to edit the configuration file manually. Just create a new JSON file with this
content and start to edit:

```json
{
  "$schema": "https://bendera.github.io/vscode-commit-message-editor/schemas/config-v1.schema.json"
}
```

### Structure of the portable configuration file

#### configVersion

Currently: `"1"`. It might change in the future.

#### staticTemplate

Template for the text view, an array of strings. Every item in the array is a single line.

#### dynamicTemplate

Template for the form view, an array of strings. Every item in the array is a single line.
Form fields (see the next section) can be referenced in the the template with the `{token_name}` format.

#### tokens

An array of token objects. It defines the form fields. The table below shows the structure of a token object:

| Name                       | Type    | Description                                                                                                                                                            | Valid for |
| -------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| label                      | string  | The label of the form item.                                                                                                                                            | all       |
| name                       | string  | The token name in the template.                                                                                                                                        | all       |
| value                      | string  | The value of the boolean token when it is true                                                                                                                         | boolean   |
| type                       | enum    | The type of the token. Valid values are:<br> **text**: displayed as a text input<br>**boolean**: displayed as a checkbox<br>**enum**: displayed as a dropdown selector | all       |
| description                | string  | A longer text under the form item                                                                                                                                      | all       |
| prefix                     | string  | Text before the value. It will only be applied if the value is not empty                                                                                               | all       |
| suffix                     | string  | Text after the value. It will only be applied if the value is not empty                                                                                                | all       |
| multiline                  | boolean | Multiline text input                                                                                                                                                   | text      |
| monospace                  | boolean | Use the monospace editor in the multiline mode                                                                                                                         | text      |
| lines                      | number  | Textarea initial height in lines                                                                                                                                       | text      |
| maxLines                   | number  | Textarea maximum height in lines                                                                                                                                       | text      |
| maxLength                  | number  | Maximum length of the value                                                                                                                                            | text      |
| maxLineLength              | number  | The position of the vertical ruler when the monospace editor is used                                                                                                   | text      |
| multiple                   | boolean | Multiple options                                                                                                                                                       | enum      |
| separator                  | string  | Separator character when multiple options were selected                                                                                                                | enum      |
| combobox                   | boolean | Is the selector filterable or not                                                                                                                                      | enum      |
| options                    | array   | Available options                                                                                                                                                      | enum      |
| options[_{n}_].label       | string  | The value of the option                                                                                                                                                | enum      |
| options[_{n}_].description | string  | A longer description for the option                                                                                                                                    | enum      |

### Sample configs

- [Default](example-configs/default.json)
- [Gitmojis](example-configs/gitmojis.json)
- [Gitmojis - With Simplifed Chinese descriptions](example-configs/gitmojis_zh-CN.json)

You can customize the Gitmoji config with the `scripts/gitmoji-config.js` script
