import {expect, fixture, html} from '@open-wc/testing';
import {TokenItemEdit} from '../../../components/cme-token-item-edit/cme-token-item-edit';

describe('cme-token-item-edit', () => {
  it('is defined', () => {
    const el = document.createElement('cme-token-item-edit');
    expect(el).to.instanceOf(TokenItemEdit);
  });

  it('token property should return a valid default token value', () => {
    const el = document.createElement('cme-token-item-edit') as TokenItemEdit;
    expect(el.token).to.deep.eq({label: '', name: '', type: 'text'});
  });

  it('should return a text type token configuration object', async () => {
    const el = (await fixture(
      html`<cme-token-item-edit></cme-token-item-edit>`
    )) as TokenItemEdit;

    el.active = true;

    await el.updateComplete;

    const iName = el.shadowRoot?.querySelector('#name');
    const iLabel = el.shadowRoot?.querySelector('#label');
    const iType = el.shadowRoot?.querySelector('#type');
    const iDescription = el.shadowRoot?.querySelector('#description');
    const iPrefix = el.shadowRoot?.querySelector('#prefix');
    const iSuffix = el.shadowRoot?.querySelector('#suffix');
    const cMultiline = el.shadowRoot?.querySelector('#multiline');
    const iLines = el.shadowRoot?.querySelector('#lines');
    const iMaxLines = el.shadowRoot?.querySelector('#maxLines');
    const iMaxLength = el.shadowRoot?.querySelector('#maxLength');
    const iMaxLineLength = el.shadowRoot?.querySelector('#maxLineLength');
    const cMonoSpace = el.shadowRoot?.querySelector('#monospace');

    iName?.dispatchEvent(new CustomEvent('vsc-input', {detail: 'Name test'}));
    iLabel?.dispatchEvent(new CustomEvent('vsc-input', {detail: 'Label test'}));
    iType?.dispatchEvent(
      new CustomEvent('vsc-change', {
        detail: {
          selectedIndex: 0,
          value: 'text',
        },
      })
    );
    iDescription?.dispatchEvent(
      new CustomEvent('vsc-input', {detail: 'Description test'})
    );
    iPrefix?.dispatchEvent(
      new CustomEvent('vsc-input', {detail: 'Prefix test'})
    );
    iSuffix?.dispatchEvent(
      new CustomEvent('vsc-input', {detail: 'Suffix test'})
    );
    cMultiline?.dispatchEvent(
      new CustomEvent('vsc-change', {detail: {checked: true}})
    );
    iLines?.dispatchEvent(new CustomEvent('vsc-input', {detail: '5'}));
    iMaxLines?.dispatchEvent(new CustomEvent('vsc-input', {detail: '10'}));
    iMaxLength?.dispatchEvent(new CustomEvent('vsc-input', {detail: '100'}));
    iMaxLineLength?.dispatchEvent(new CustomEvent('vsc-input', {detail: '72'}));
    cMonoSpace?.dispatchEvent(
      new CustomEvent('vsc-change', {detail: {checked: true}})
    );

    expect(el.token).to.deep.eq({
      description: 'Description test',
      label: 'Label test',
      lines: 5,
      maxLength: 100,
      maxLines: 10,
      maxLineLength: 72,
      monospace: true,
      multiline: true,
      name: 'Name test',
      prefix: 'Prefix test',
      suffix: 'Suffix test',
      type: 'text',
    });
  });

  it('should return a boolean type token configuration object', async () => {
    const el = (await fixture(
      html`<cme-token-item-edit></cme-token-item-edit>`
    )) as TokenItemEdit;

    el.active = true;

    await el.updateComplete;

    const iName = el.shadowRoot?.querySelector('#name');
    const iLabel = el.shadowRoot?.querySelector('#label');
    const iValue = el.shadowRoot?.querySelector('#value');
    const iType = el.shadowRoot?.querySelector('#type');
    const iDescription = el.shadowRoot?.querySelector('#description');
    const iPrefix = el.shadowRoot?.querySelector('#prefix');
    const iSuffix = el.shadowRoot?.querySelector('#suffix');

    iName?.dispatchEvent(new CustomEvent('vsc-input', {detail: 'Name test'}));
    iLabel?.dispatchEvent(new CustomEvent('vsc-input', {detail: 'Label test'}));
    iValue?.dispatchEvent(new CustomEvent('vsc-input', {detail: 'Value test'}));
    iType?.dispatchEvent(
      new CustomEvent('vsc-change', {
        detail: {
          selectedIndex: 1,
          value: 'boolean',
        },
      })
    );
    iDescription?.dispatchEvent(
      new CustomEvent('vsc-input', {detail: 'Description test'})
    );
    iPrefix?.dispatchEvent(
      new CustomEvent('vsc-input', {detail: 'Prefix test'})
    );
    iSuffix?.dispatchEvent(
      new CustomEvent('vsc-input', {detail: 'Suffix test'})
    );

    expect(el.token).to.deep.eq({
      description: 'Description test',
      label: 'Label test',
      value: 'Value test',
      name: 'Name test',
      prefix: 'Prefix test',
      suffix: 'Suffix test',
      type: 'boolean',
    });
  });

  it('should return an enum type token configuration object', async () => {
    const el = (await fixture(
      html`<cme-token-item-edit></cme-token-item-edit>`
    )) as TokenItemEdit;

    el.active = true;

    await el.updateComplete;

    const iName = el.shadowRoot?.querySelector('#name');
    const iLabel = el.shadowRoot?.querySelector('#label');
    const iType = el.shadowRoot?.querySelector('#type');
    const iDescription = el.shadowRoot?.querySelector('#description');
    const iPrefix = el.shadowRoot?.querySelector('#prefix');
    const iSuffix = el.shadowRoot?.querySelector('#suffix');
    const cMultiple = el.shadowRoot?.querySelector('#multiple');
    const iSeparator = el.shadowRoot?.querySelector('#separator');
    const cCombobox = el.shadowRoot?.querySelector('#combobox');
    const bEditOptions = el.shadowRoot?.querySelector('.edit-options-button');

    iName?.dispatchEvent(new CustomEvent('vsc-input', {detail: 'Name test'}));
    iLabel?.dispatchEvent(new CustomEvent('vsc-input', {detail: 'Label test'}));
    iType?.dispatchEvent(
      new CustomEvent('vsc-change', {
        detail: {
          selectedIndex: 2,
          value: 'enum',
        },
      })
    );
    iDescription?.dispatchEvent(
      new CustomEvent('vsc-input', {detail: 'Description test'})
    );
    iPrefix?.dispatchEvent(
      new CustomEvent('vsc-input', {detail: 'Prefix test'})
    );
    iSuffix?.dispatchEvent(
      new CustomEvent('vsc-input', {detail: 'Suffix test'})
    );
    cMultiple?.dispatchEvent(
      new CustomEvent('vsc-change', {detail: {checked: true}})
    );
    iSeparator?.dispatchEvent(
      new CustomEvent('vsc-input', {detail: 'Separator test'})
    );
    cCombobox?.dispatchEvent(
      new CustomEvent('vsc-change', {detail: {checked: true}})
    );
    bEditOptions?.dispatchEvent(new MouseEvent('click'));

    await el.updateComplete;

    const optWindow = el.shadowRoot?.querySelector('cme-token-options-edit');

    optWindow?.dispatchEvent(
      new CustomEvent('save', {
        detail: [
          {
            label: 'Test option',
            value: 'test value',
            description: 'Test description',
          },
        ],
      })
    );

    expect(el.token).to.deep.eq({
      combobox: true,
      description: 'Description test',
      label: 'Label test',
      multiple: true,
      name: 'Name test',
      options: [
        {
          description: 'Test description',
          label: 'Test option',
          value: 'test value',
        },
      ],
      prefix: 'Prefix test',
      separator: 'Separator test',
      suffix: 'Suffix test',
      type: 'enum',
    });
  });

  describe('conditional tokens', () => {
    it('should properly update conditional token related fields', async () => {
      const el = (await fixture(
        html`<cme-token-item-edit></cme-token-item-edit>`
      )) as TokenItemEdit;

      el.active = true;
      el.tokens = [{
        name: 'test token',
        label: 'Test token',
        type: 'text',
      }];

      await el.updateComplete;

      const isConditionalToken = el.shadowRoot?.getElementById('isConditionalToken');

      isConditionalToken?.dispatchEvent(
        new CustomEvent('vsc-change', {detail: {checked: true}})
      );

      await el.updateComplete;
      const linkedToken = el.shadowRoot?.getElementById('linkedToken');

      linkedToken?.dispatchEvent(
        new CustomEvent('vsc-change', {detail: {value: 'test token'}})
      );

      await el.updateComplete;
      const matchValue = el.shadowRoot?.getElementById('matchValue');

      matchValue?.dispatchEvent(
        new CustomEvent('vsc-input', {detail: {value: 'test value'}})
      );

      await el.updateComplete;

      expect(el.token).to.deep.eq({
        isConditionalToken: true,
        linkedToken: el.tokens[0],
        matchValue: 'test value',
        label: '',
        type: 'text',
        name: '',
      })
    });

    it('should render Is conditional token checkbox', async () => {
      const el = (await fixture(
        html`<cme-token-item-edit></cme-token-item-edit>`
      )) as TokenItemEdit;

      el.active = true;

      await el.updateComplete;

      expect(el.shadowRoot?.getElementById('isConditionalToken')).to.exist;
    });

    it('should render a dropdown to select the linked token if conditional token is checked', async () => {
      const el = (await fixture(
        html`<cme-token-item-edit></cme-token-item-edit>`
      )) as TokenItemEdit;

      el.active = true;
      el.token = {
        ...el.token,
        isConditionalToken: true
      };

      await el.updateComplete;

      expect(el.shadowRoot?.getElementById('linkedToken')).to.exist;
    });

    it('should render match value text input if linked token is selected and token is conditional', async () => {
      const el = (await fixture(
        html`<cme-token-item-edit></cme-token-item-edit>`
      )) as TokenItemEdit;

      el.active = true;
      el.token = {
        ...el.token,
        isConditionalToken: true,
        linkedToken: {
          name: 'test token',
          label: 'Test token',
          type: 'text',
        }
      };

      await el.updateComplete;

      const matchValueInput = el.shadowRoot?.getElementById('matchValue');
      expect(matchValueInput).to.exist;
      expect(matchValueInput?.tagName.toLowerCase()).to.eq('vscode-inputbox');
    });

    it('should render a select input if linked token is an enum token', async () => {
      const el = (await fixture(
        html`<cme-token-item-edit></cme-token-item-edit>`
      )) as TokenItemEdit;

      el.active = true;
      el.token = {
        ...el.token,
        isConditionalToken: true,
        linkedToken: {
          name: 'test token',
          label: 'Test token',
          type: 'enum',
          options: [
            {
              label: 'Test option 1',
              description: '',
              value: 'testoption1'
            },
            {
              label: 'Test option 2',
              description: '',
              value: 'testoption2'
            },
          ]
        }
      };

      await el.updateComplete;

      const matchValueInput = el.shadowRoot?.getElementById('matchValue');
      expect(matchValueInput).to.exist;
      expect(matchValueInput?.tagName.toLowerCase()).to.eq('vscode-single-select');
      const options = matchValueInput?.querySelectorAll('vscode-option');
      expect(options?.length).to.eq(2);
      expect(options?.item(0)?.textContent).to.eq('Test option 1');
      expect(options?.item(1)?.textContent).to.eq('Test option 2');
    });

    it('should render a select input if linked token is a boolean token', async () => {
      const el = (await fixture(
        html`<cme-token-item-edit></cme-token-item-edit>`
      )) as TokenItemEdit;

      el.active = true;
      el.token = {
        ...el.token,
        isConditionalToken: true,
        linkedToken: {
          name: 'test token',
          label: 'Test token',
          type: 'boolean',
        }
      };

      await el.updateComplete;

      const matchValueInput = el.shadowRoot?.getElementById('matchValue');
      expect(matchValueInput).to.exist;
      expect(matchValueInput?.tagName.toLowerCase()).to.eq('vscode-single-select');
      const options = matchValueInput?.querySelectorAll('vscode-option');
      expect(options?.length).to.eq(2);
      expect(options?.item(0)?.textContent).to.eq('true');
      expect(options?.item(1)?.textContent).to.eq('false');
    });
  });
});
