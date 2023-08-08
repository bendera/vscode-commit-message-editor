import {expect, fixture, html} from '@open-wc/testing';
import sinon from 'sinon';
import {TokenOptionsEdit} from '../../../components/cme-token-item-edit/cme-token-options-edit';

describe('cme-token-options-edit', () => {
  it('is defined', () => {
    const el = document.createElement('cme-token-options-edit');
    expect(el).to.instanceOf(TokenOptionsEdit);
  });

  it('placeholder text should be visible when options list is empty', async () => {
    const el = await fixture(
      html`<cme-token-options-edit></cme-token-options-edit>`
    );

    expect(el.shadowRoot?.querySelector('.empty')).lightDom.to.equal(
      `There is not any option configured yet.`
    );
  });

  it('a new option should be added when "Add option" button is clicked', async () => {
    const el: TokenOptionsEdit = await fixture(
      html`<cme-token-options-edit></cme-token-options-edit>`
    );

    const bt = el.shadowRoot?.querySelector('.add-option');
    bt?.dispatchEvent(new MouseEvent('click'));

    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('.fieldset')).to.be.ok;
  });

  it('save and close event handler should be called when save button is clicked', async () => {
    const saveCallbackSpy = sinon.spy();
    const closeCallbackSpy = sinon.spy();

    const el: TokenOptionsEdit = await fixture(
      html`<cme-token-options-edit></cme-token-options-edit>`
    );

    el.addEventListener('save', saveCallbackSpy);
    el.addEventListener('close', closeCallbackSpy);

    el.options = [
      {
        label: 'Test label',
        value: 'Test value',
        description: 'Test description',
      },
    ];

    const bt = el.shadowRoot?.querySelector('.save');
    bt?.dispatchEvent(new MouseEvent('click'));

    expect(saveCallbackSpy.firstCall.args[0].detail).to.deep.eq([
      {
        label: 'Test label',
        value: 'Test value',
        description: 'Test description',
      },
    ]);
    expect(closeCallbackSpy.callCount).to.eq(1);
  });

  it('close event handler should be called when cancel button is clicked', async () => {
    const callbackSpy = sinon.spy();
    const el: TokenOptionsEdit = await fixture(
      html`<cme-token-options-edit></cme-token-options-edit>`
    );

    el.addEventListener('close', callbackSpy);

    const bt = el.shadowRoot?.querySelector('.cancel');
    bt?.dispatchEvent(new MouseEvent('click'));

    expect(callbackSpy.callCount).to.eq(1);
  });

  it('option should be changed when input changed', async () => {
    const options = [
      {
        label: 'Test label 1',
        value: 'Test value 1',
        description: 'Test description 1',
      },
      {
        label: 'Test label 2',
        value: 'Test value 2',
        description: 'Test description 2',
      },
    ];
    const el: TokenOptionsEdit = await fixture(
      html`<cme-token-options-edit></cme-token-options-edit>`
    );
    el.options = options;

    await el.updateComplete;

    const labelInput = el.shadowRoot?.querySelector(
      'vscode-inputbox[data-name="label"][data-index="1"]'
    );
    const valueInput = el.shadowRoot?.querySelector(
      'vscode-inputbox[data-name="value"][data-index="1"]'
    );
    const descriptionInput = el.shadowRoot?.querySelector(
      'vscode-inputbox[data-name="description"][data-index="1"]'
    );

    labelInput?.dispatchEvent(
      new CustomEvent('vsc-input', {detail: 'Changed label'})
    );
    valueInput?.dispatchEvent(
      new CustomEvent('vsc-input', {detail: 'Changed value'})
    );
    descriptionInput?.dispatchEvent(
      new CustomEvent('vsc-input', {detail: 'Changed description'})
    );

    expect(el.options).to.deep.eq([
      {
        label: 'Test label 1',
        value: 'Test value 1',
        description: 'Test description 1',
      },
      {
        label: 'Changed label',
        value: 'Changed value',
        description: 'Changed description',
      },
    ]);
  });

  it('option should be excluded when it is removed', async () => {
    const options = [
      {
        label: 'Test label 1',
        value: 'Test value 1',
        description: 'Test description 1',
      },
      {
        label: 'Test label 2',
        value: 'Test value 2',
        description: 'Test description 2',
      },
    ];
    const el: TokenOptionsEdit = await fixture(
      html`<cme-token-options-edit></cme-token-options-edit>`
    );
    el.options = options;

    await el.updateComplete;

    const deleteButton = el.shadowRoot?.querySelector(
      'vscode-icon[name="trash"][data-index="1"]'
    );
    deleteButton?.dispatchEvent(new MouseEvent('click'));

    await el.updateComplete;

    expect(el.options).to.deep.eq([
      {
        label: 'Test label 1',
        value: 'Test value 1',
        description: 'Test description 1',
      },
    ]);
  });

  it('rmoved option should be undoable', async () => {
    const options = [
      {
        label: 'Test label 1',
        value: 'Test value 1',
        description: 'Test description 1',
      },
      {
        label: 'Test label 2',
        value: 'Test value 2',
        description: 'Test description 2',
      },
    ];
    const el: TokenOptionsEdit = await fixture(
      html`<cme-token-options-edit></cme-token-options-edit>`
    );
    el.options = options;

    await el.updateComplete;

    const deleteButton = el.shadowRoot?.querySelector(
      'vscode-icon[name="trash"][data-index="1"]'
    );
    deleteButton?.dispatchEvent(new MouseEvent('click'));

    await el.updateComplete;

    expect(el.options).to.deep.eq([
      {
        label: 'Test label 1',
        value: 'Test value 1',
        description: 'Test description 1',
      },
    ]);

    const undoButton = el.shadowRoot?.querySelector('.undo');

    expect(undoButton).to.be.ok;

    undoButton?.dispatchEvent(new MouseEvent('click'));

    await el.updateComplete;

    expect(el.options).to.deep.eq([
      {
        label: 'Test label 1',
        value: 'Test value 1',
        description: 'Test description 1',
      },
      {
        label: 'Test label 2',
        value: 'Test value 2',
        description: 'Test description 2',
      },
    ]);
  });
});
