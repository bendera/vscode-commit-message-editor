import {expect, fixture, html, nextFrame} from '@open-wc/testing';
import {FormView} from '../../../components/cme-form-view/cme-form-view';
import store from '../../../store/store';
import {
  closeTab,
  confirmAmend,
  copyToSCMInputBox,
  receiveConfig,
  updateTokenValues,
} from '../../../store/actions';
import sinon, {SinonSpy} from 'sinon';

const createConfig = (): ExtensionConfig => ({
  'commit-message-editor': {
    confirmAmend: true,
    dynamicTemplate: [
      '{type}{scope}{gitmoji}: {description}',
      '',
      '{body}',
      '',
      '{breaking_change}{footer}',
    ],
    staticTemplate: [
      'feat: Short description',
      '',
      'Message body',
      '',
      'Message footer',
    ],
    tokens: [
      {
        label: 'Type',
        name: 'type',
        type: 'enum',
        options: [
          {
            label: 'build',
            description:
              'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
          },
          {
            label: 'chore',
            description: 'Updating grunt tasks etc; no production code change',
          },
        ],
        description: 'Type of changes',
      },
      {
        label: 'Scope',
        name: 'scope',
        description:
          'A scope may be provided to a commit’s type, to provide additional contextual information and is contained within parenthesis, e.g., "feat(parser): add ability to parse arrays".',
        type: 'enum',
        options: [
          {
            label: 'Lorem',
            value: 'lorem',
            description: 'Example scope',
          },
          {
            label: 'Ipsum',
            value: 'ipsum',
            description: 'Another example scope',
          },
        ],
        multiple: true,
        separator: '|',
        prefix: '(',
        suffix: ')',
      },
      {
        label: 'Gitmoji',
        name: 'gitmoji',
        description: 'Gitmoji example',
        type: 'enum',
        options: [
          {
            label: '⚡️ zap',
            value: '⚡️',
          },
          {
            label: '🔥 fire',
            value: '🔥',
          },
          {
            label: '💚 green_heart',
            value: '💚',
          },
        ],
        combobox: true,
        filter: 'fuzzy',
      },
      {
        label: 'Short description',
        name: 'description',
        description: 'Short description in the subject line.',
        type: 'text',
        multiline: false,
      },
      {
        label: 'Body',
        name: 'body',
        description: 'Optional body',
        type: 'text',
        multiline: true,
      },
      {
        label: 'Breaking change',
        name: 'breaking_change',
        type: 'boolean',
        value: 'BREAKING CHANGE: ',
      },
      {
        label: 'Footer',
        name: 'footer',
        description: 'Optional footer',
        type: 'text',
        multiline: true,
      },
    ],
    view: {
      defaultView: 'text',
      visibleViews: 'form',
      fullWidth: false,
      useMonospaceEditor: true,
      tabSize: 2,
      useTabs: true,
      rulers: [50, 72],
      visibleLines: 10,
      showRecentCommits: true,
      saveAndClose: true,
    },
  },
  git: {
    inputValidationLength: 72,
    inputValidationSubjectLength: 50,
  },
});

describe('cme-form-view', () => {
  let el: FormView | undefined;
  let storeSpy: SinonSpy;

  beforeEach(() => {
    storeSpy = sinon.spy(store, 'dispatch');
    el = document.createElement('cme-form-view') as FormView;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el as FormView);
    el = undefined;
    storeSpy.restore();
  });

  it('is defined', () => {
    const el = document.createElement('cme-form-view');
    expect(el).to.instanceOf(FormView);
  });

  it('the source control input box should be updated then the extension tab should be closed', async () => {
    const config = createConfig();
    const el: FormView = await fixture(html`<cme-form-view></cme-form-view>`);

    await el.updateComplete;

    store.dispatch(receiveConfig(config));
    store.dispatch(
      updateTokenValues({
        type: 'feat',
        scope: 'lorem',
        gitmoji: '⚡️',
        description: 'short description test',
        body: 'body test',
        breaking_change: 'BREAKING CHANGE: ',
        footer: 'footer test',
      })
    );

    await el.updateComplete;

    storeSpy.resetHistory();
    const successButton = el.shadowRoot?.querySelector('#success-button-form');
    successButton?.dispatchEvent(new MouseEvent('click'));
    const calls = storeSpy.getCalls();

    let message = '';
    message += 'feat(lorem)⚡️: short description test\n';
    message += '\n';
    message += 'body test\n';
    message += '\n';
    message += 'BREAKING CHANGE: footer test';

    expect(calls[0].firstArg).to.deep.equal(copyToSCMInputBox(message));
    expect(calls[1].firstArg).to.deep.equal(closeTab());
  });

  it('the source control input box should be updated then the extension tab should not be closed', async () => {
    const config = createConfig();
    config['commit-message-editor'].view.saveAndClose = false;
    const el: FormView = await fixture(html`<cme-form-view></cme-form-view>`);

    await el.updateComplete;

    store.dispatch(receiveConfig(config));
    store.dispatch(
      updateTokenValues({
        type: 'feat',
        scope: 'lorem',
        gitmoji: '⚡️',
        description: 'short description test',
        body: 'body test',
        breaking_change: 'BREAKING CHANGE: ',
        footer: 'footer test',
      })
    );

    await el.updateComplete;

    storeSpy.resetHistory();
    const successButton = el.shadowRoot?.querySelector('#success-button-form');
    successButton?.dispatchEvent(new MouseEvent('click'));
    const calls = storeSpy.getCalls();

    let message = '';
    message += 'feat(lorem)⚡️: short description test\n';
    message += '\n';
    message += 'body test\n';
    message += '\n';
    message += 'BREAKING CHANGE: footer test';

    expect(calls[0].firstArg).to.deep.equal(copyToSCMInputBox(message));
    expect(calls[1]).to.be.undefined;
  });

  it('confirm amend action should be dispatched', async () => {
    const config = createConfig();
    const el: FormView = await fixture(html`<cme-form-view></cme-form-view>`);

    await el.updateComplete;

    store.dispatch(receiveConfig(config));
    store.dispatch(
      updateTokenValues({
        type: 'feat',
        scope: 'lorem',
        gitmoji: '⚡️',
        description: 'short description test',
        body: 'body test',
        breaking_change: 'BREAKING CHANGE: ',
        footer: 'footer test',
      })
    );

    await el.updateComplete;

    const checkbox = el.shadowRoot?.querySelector('#form-amend-checkbox');
    checkbox?.dispatchEvent(
      new CustomEvent('vsc-change', {detail: {checked: true}})
    );

    await el.updateComplete;

    storeSpy.resetHistory();
    const successButton = el.shadowRoot?.querySelector('#success-button-form');
    successButton?.dispatchEvent(new MouseEvent('click'));
    const calls = storeSpy.getCalls();

    let message = '';
    message += 'feat(lorem)⚡️: short description test\n';
    message += '\n';
    message += 'body test\n';
    message += '\n';
    message += 'BREAKING CHANGE: footer test';

    expect(calls[0].firstArg).to.deep.equal(confirmAmend(message));
    expect(calls[1]).to.be.undefined;
  });

  it('closeTab action should be called when cancel button is clicked', async () => {
    const el: FormView = await fixture(html`<cme-form-view></cme-form-view>`);

    const button = el.shadowRoot?.querySelector('#cancel-button-form');
    button?.dispatchEvent(new MouseEvent('click'));

    const calls = storeSpy.getCalls();

    expect(calls[0].firstArg).to.deep.equal(closeTab());
  });

  xit('token values should be updated when connectedCallback is called', async () => {
    const el: FormView = await fixture(html`<cme-form-view></cme-form-view>`);

    await el.updateComplete;
    await nextFrame();

    const calls = storeSpy.getCalls();

    expect(calls[0].firstArg).to.deep.equal(
      updateTokenValues({
        body: 'body test',
        breaking_change: 'BREAKING CHANGE: ',
        description: 'short description test',
        footer: 'footer test',
        gitmoji: '⚡️',
        scope: '',
        type: 'build',
      })
    );
  });

  xit('idk', async () => {
    const el: FormView = await fixture(html`<cme-form-view></cme-form-view>`);

    await el.updateComplete;
    await nextFrame();

    storeSpy.resetHistory();

    const slType = el.shadowRoot?.querySelector(
      'vscode-single-select[name="type"]'
    );
    const slScope = el.shadowRoot?.querySelector(
      'vscode-multi-select[name="scope"]'
    );
    const tfScope = el.shadowRoot?.querySelector(
      'vscode-inputbox[name="description"]'
    );
    const cbBreakingChange = el.shadowRoot?.querySelector(
      'vscode-checkbox[name="breaking_change"]'
    );

    slType?.dispatchEvent(new CustomEvent('vsc-change'));
    slScope?.dispatchEvent(new CustomEvent('vsc-change'));
    tfScope?.dispatchEvent(new CustomEvent('vsc-change'));
    cbBreakingChange?.dispatchEvent(new CustomEvent('vsc-change'));

    const expectedAction = updateTokenValues({
      body: 'body test',
      breaking_change: 'BREAKING CHANGE: ',
      description: 'short description test',
      footer: 'footer test',
      gitmoji: '⚡️',
      scope: '',
      type: 'build',
    });

    const calls = storeSpy.getCalls();

    expect(calls[0].firstArg).to.deep.equal(expectedAction);
    expect(calls[1].firstArg).to.deep.equal(expectedAction);
    expect(calls[2].firstArg).to.deep.equal(expectedAction);
    expect(calls[3].firstArg).to.deep.equal(expectedAction);
    expect(calls[4]).to.be.undefined;
  });
});
