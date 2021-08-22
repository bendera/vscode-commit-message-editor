import {expect, fixture, html} from '@open-wc/testing';
import {FormView} from '../../../components/cme-form-view/cme-form-view';
import store from '../../../store/store';
import {
  closeTab,
  copyToSCMInputBox,
  receiveConfig,
  updateTokenValues,
} from '../../../store/actions';
import sinon, {SinonSpy} from 'sinon';

const createConfig = (): ExtensionConfig => ({
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
    config.view.saveAndClose = false;
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
});
