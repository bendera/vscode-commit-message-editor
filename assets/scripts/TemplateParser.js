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
      compiled = compiled.replace(new RegExp(`{${key}}`, 'g'), val);
    });

    compiled = compiled.replace(/\n{3,}/g, '\n');

    compiled = compiled.replace(/\n+$/g, '');

    return compiled;
  }

  _getTokenByName(name) {
    return this._tokens.find(token => token.name === name);
  }

  _getValues() {
    const inputs = this._formElement.querySelectorAll(
      'vscode-inputbox, vscode-select, vscode-checkbox'
    );
    const valueMap = new Map();

    inputs.forEach((el) => {
      const name = el.dataset.name;
      const token = this._getTokenByName(name);
      const prefix = token.prefix || '';
      const suffix = token.suffix || '';
      let value = '';

      if (el.tagName.toLowerCase() === 'vscode-checkbox') {
        value = el.checked ? el.value : '';
      } else {
        value = el.value;
      }

      value = value ? prefix + value + suffix : '';
      valueMap.set(name, value);
    });

    return valueMap;
  }
}
