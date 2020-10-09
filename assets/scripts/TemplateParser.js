class TemplateParser {
  constructor(formElement, config) {
    this._formElement = formElement;
    this._template = config.dynamicTemplate.join('\n');
    this._tokens = config.tokens;
  }

  getCompiledTemplate() {
    const values = this._getValues();
    let compiled = this._template;

    values.forEach((val, key) => {
      // prevent parse empty fields

      compiled = compiled.replace(new RegExp(`{${key}}`, 'g'), val);
    });

    compiled = compiled.replace(/\n{3,}/g, '\n');

    compiled = compiled.replace(/\n+$/g, '');

    return compiled;
  }

  _getTokenByName(name) {
    return this._tokens.find((token) => token.name === name);
  }

  _getValues() {
    const inputs = this._formElement.querySelectorAll(
      'vscode-inputbox, vscode-select, vscode-checkbox'
    );
    const valueMap = new Map();

    inputs.forEach((tag) => {
      const name = tag.dataset.name;
      const token = this._getTokenByName(name);
      const prefix = token.prefix || '';
      const suffix = token.suffix || '';
      const tagName = tag.tagName.toLowerCase();
      const userValue = this._getTagValue(tagName, tag, prefix, suffix);

      valueMap.set(name, userValue);
    });

    return valueMap;
  }

  _getTagValue(tagName, tag, prefix, suffix) {
    let tagValue = null;
    try {
      switch (tagName) {
        case 'vscode-checkbox':
          tagValue = tag.checked ? tag.value : '';
          break;
        case 'vscode-select':
          if (tag._currentLabel && tag._selectedIndex != 0)
            tagValue = tag._currentLabel;
          break;
        default:
          tagValue = tag.value;
          break;
      }
    } catch (e) {
      tagValue = null;
      console.error(e);
    }

    return tagValue ? prefix + tagValue + suffix : '';
  }
}
