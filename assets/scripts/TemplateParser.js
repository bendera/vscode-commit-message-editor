class TemplateParser {
  constructor(formElement, config) {
    console.log('form, config:', formElement, config);
    this._formElement = formElement;
    this._template = config.template.join('\n');
    this._tokens = config.tokens;
    this._values = {};
  }

  compile() {
    console.log(this._getValues());
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

      value = prefix + value + suffix;
      valueMap.set(name, value);
    });

    return valueMap;
  }
}
