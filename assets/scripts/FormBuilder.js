class FormBuilder {
  constructor() {
    console.log('FormBuilder');
    this._template = {};
    this._fields = [];
    this._compiledFields = {};
  }

  _enumField() {

  }

  _booleanField() {

  }

  _textField() {
    const el = document.createElement('input');

    return el;
  }

  setTemplate(template) {
    this._template = template.join('\n');
  }

  setFields(fields) {
    this._fields = fields;
  }

  compile() {
    this._fields.forEach((fieldDef) => {
      this._compiledFields[fieldDef.name] = this[`_${fieldDef.type}Field`](fieldDef);
    });

    console.dir(this._compiledFields);
  }
}
