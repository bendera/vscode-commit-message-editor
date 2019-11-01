class FormBuilder {
  constructor() {
    this._template = {};
    this._fields = [];
    this._compiledFields = [];
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
    const options = [];

    fieldDef.options.forEach((option) => {
      const opt = {};
      const { label, description } = option;

      opt.label = label;
      opt.value = label;
      opt.description = description;

      options.push(opt);
    });

    el.options = options;
    el.dataset.name = fieldDef.name;

    return this._formItem(fieldDef, el);
  }

  _booleanField(fieldDef) {
    const el = document.createElement('vscode-checkbox');

    el.label = fieldDef.label;
    el.dataset.name = fieldDef.name;
    el.value = fieldDef.value;

    return this._formItem(fieldDef, el);
  }

  _textField(fieldDef) {
    const el = document.createElement('vscode-inputbox');

    if (fieldDef.multiline && fieldDef.multiline === true) {
      el.multiline = true;
    }

    el.dataset.name = fieldDef.name;

    return this._formItem(fieldDef, el);
  }

  setTemplate(template) {
    this._template = template.join('\n');
  }

  setFields(fields) {
    this._fields = fields;
  }

  compile() {
    this._fields.forEach((fieldDef) => {
      this._compiledFields.push(this[`_${fieldDef.type}Field`](fieldDef));
    });

    console.dir(this._compiledFields);
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
