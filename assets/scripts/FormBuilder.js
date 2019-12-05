class FormBuilder {
  constructor() {
    this._template = {};
    this._fields = [];
    this._compiledFields = [];
    this._saveFieldValueCallback = () => {};
    this._prevState = {};
  }

  _getFieldValue(name, defaultValue = '') {
    if (this._prevState[name]) {
      return this._prevState[name];
    }

    return defaultValue;
  }

  _formItem(fieldDef, widgetElement) {
    const formItemEl = document.createElement('vscode-form-item');

    if (fieldDef.label) {
      const labelEl = document.createElement('vscode-form-label');

      labelEl.innerHTML = fieldDef.label;

      formItemEl.appendChild(labelEl);
    }

    if (fieldDef.description) {
      const descriptionEl = document.createElement('vscode-form-description');

      descriptionEl.innerHTML = `<p>${fieldDef.description}</p>`;

      formItemEl.appendChild(descriptionEl);
    }

    const formControlEl = document.createElement('vscode-form-control');

    formControlEl.appendChild(widgetElement);
    formItemEl.appendChild(formControlEl);

    return formItemEl;
  }

  _enumField(fieldDef) {
    const el = document.createElement('vscode-select');
    const elOptions = [];
    const { options, name } = fieldDef;

    options.forEach((option) => {
      const opt = {};
      const { label, description, value } = option;

      opt.label = label;
      opt.value = value !== undefined ? value : label;
      opt.description = description;

      elOptions.push(opt);
    });

    el.options = elOptions;
    el.dataset.name = name;
    el.selectedIndex = this._getFieldValue(name, 0);
    el.addEventListener('vsc-change', () => {
      this._saveFieldValueCallback(name, el.selectedIndex);
    });

    return this._formItem(fieldDef, el);
  }

  _booleanField(fieldDef) {
    const el = document.createElement('vscode-checkbox');
    const { label, name, value } = fieldDef;

    el.label = label;
    el.dataset.name = name;
    el.value = value;
    el.checked = this._getFieldValue(name, false);

    el.addEventListener('vsc-change', (event) => {
      const { checked } = event.detail;

      this._saveFieldValueCallback(name, checked);
    });

    return this._formItem(fieldDef, el);
  }

  _textField(fieldDef) {
    const el = document.createElement('vscode-inputbox');
    const { name, multiline } = fieldDef;

    if (multiline && multiline === true) {
      el.multiline = true;
    }

    el.dataset.name = name;
    el.value = this._getFieldValue(name);

    el.addEventListener('vsc-input', () => {
      this._saveFieldValueCallback(name, el.value);
    });

    return this._formItem(fieldDef, el);
  }

  setPrevState(state) {
    this._prevState = { ...state };
  }

  setTemplate(template) {
    this._template = template.join('\n');
  }

  setFields(fields) {
    this._fields = fields;
  }

  setSaveFieldValueCallback(fn) {
    this._saveFieldValueCallback = fn;
  }

  compile() {
    this._fields.forEach((fieldDef) => {
      this._compiledFields.push(this[`_${fieldDef.type}Field`](fieldDef));
    });
  }

  getForm() {
    return this._compiledFields;
  }

  appendTo(container) {
    this._compiledFields.forEach((el) => {
      container.appendChild(el);
    });
  }
}
