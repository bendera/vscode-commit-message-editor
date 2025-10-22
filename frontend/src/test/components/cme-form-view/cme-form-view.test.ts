import {expect, fixture, html} from '@open-wc/testing';
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
import {VscodeSingleSelect} from '@bendera/vscode-webview-elements/dist/vscode-single-select';
import {VscodeMultiSelect} from '@bendera/vscode-webview-elements/dist/vscode-multi-select';
import {VscodeInputbox} from '@bendera/vscode-webview-elements/dist/vscode-inputbox';
import {VscodeCheckbox} from '@bendera/vscode-webview-elements/dist/vscode-checkbox';

const createConfig = (): ExtensionConfig => {
  const issueTypeToken: Token = {
    label: 'Issue type',
    name: 'issue_type',
    type: 'enum',
    options: [
      {
        label: 'feature',
      },
      {
        label: 'bug',
      },
    ]
  };
  return {
    confirmAmend: true,
    dynamicTemplate: [
      '{type}{scope}{gitmoji}: {description}',
      '',
      '{body}',
      '',
      '{root_cause}',
      '',
      '{fix}',
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
      issueTypeToken,
      {
        label: 'Root cause',
        name: 'root_cause',
        prefix: 'Root cause: ',
        type: 'text',
        isConditionalToken: true,
        linkedToken: issueTypeToken,
        matchValue: 'bug',
      },
      {
        label: 'Fix',
        name: 'fix',
        prefix: 'Fix: ',
        type: 'text',
        isConditionalToken: true,
        linkedToken: issueTypeToken,
        matchValue: 'bug',
      },
    ],
    reduceEmptyLines: true,
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
  };
};

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
        issue_type: 'feature'
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

    expect(calls[0].firstArg).to.deep.equal(
      copyToSCMInputBox({
        commitMessage: message,
        selectedRepositoryPath: '',
      })
    );
    expect(calls[1].firstArg).to.deep.equal(closeTab());
  });

  it('should render conditional field values if its visible', async () => {
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
        issue_type: 'bug',
        root_cause: 'I\'m an idiot',
        fix: 'Increased intelluct'
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
    message += 'Root cause: I\'m an idiot\n';
    message += '\n';
    message += 'Fix: Increased intelluct\n';
    message += '\n';
    message += 'BREAKING CHANGE: footer test';

    expect(calls[0].firstArg).to.deep.equal(
      copyToSCMInputBox({
        commitMessage: message,
        selectedRepositoryPath: '',
      })
    );
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
        issue_type: 'feature'
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

    expect(calls[0].firstArg).to.deep.equal(
      copyToSCMInputBox({commitMessage: message, selectedRepositoryPath: ''})
    );
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
        issue_type: 'bug',
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

  it('UPDATE_TOKEN_VALUES should be dispatched with proper payload when a form item changed', async () => {
    const el: FormView = await fixture(html`<cme-form-view></cme-form-view>`);

    await el.updateComplete;

    storeSpy.resetHistory();

    const slType = el.shadowRoot?.querySelector(
      'vscode-single-select[name="type"]'
    ) as VscodeSingleSelect;
    slType!.value = 'chore';
    slType?.dispatchEvent(new CustomEvent('vsc-change'));

    const slScope = el.shadowRoot?.querySelector(
      'vscode-multi-select[name="scope"]'
    ) as VscodeMultiSelect;
    slScope!.value = ['lorem', 'ipsum'];
    slScope?.dispatchEvent(new CustomEvent('vsc-change'));

    const tfDescription = el.shadowRoot?.querySelector(
      'vscode-inputbox[name="description"]'
    ) as VscodeInputbox;
    tfDescription!.value = 'test description';
    tfDescription?.dispatchEvent(new CustomEvent('vsc-change'));

    const cbBreakingChange = el.shadowRoot?.querySelector(
      'vscode-checkbox[name="breaking_change"]'
    ) as VscodeCheckbox;
    cbBreakingChange.value = 'BREAKING CHANGE';
    cbBreakingChange.checked = true;
    cbBreakingChange?.dispatchEvent(new CustomEvent('vsc-change'));

    const slIssueType = el.shadowRoot?.querySelector(
      'vscode-single-select[name="issue_type"]'
    ) as VscodeSingleSelect;
    slIssueType!.value = 'bug';
    slIssueType?.dispatchEvent(new CustomEvent('vsc-change'));

    expect(storeSpy.callCount).to.eq(5);

    const slRootCause = el.shadowRoot?.querySelector(
      'vscode-inputbox[name="root_cause"]'
    ) as VscodeInputbox;

    slRootCause!.value = 'No idea man';
    slRootCause?.dispatchEvent(new CustomEvent('vsc-change'));

    const slFix = el.shadowRoot?.querySelector(
      'vscode-inputbox[name="fix"]'
    ) as VscodeInputbox;
    slFix!.value = 'Yet to figure out LOL';
    slFix?.dispatchEvent(new CustomEvent('vsc-change'));

    const calls = storeSpy.getCalls();

    expect(calls[0].firstArg).to.deep.equal(
      updateTokenValues({
        body: '',
        breaking_change: '',
        description: '',
        footer: '',
        gitmoji: '',
        scope: '',
        type: 'chore',
        issue_type: 'feature',
        root_cause: '',
        fix: ''
      })
    );
    expect(calls[1].firstArg).to.deep.equal(
      updateTokenValues({
        body: '',
        breaking_change: '',
        description: '',
        footer: '',
        gitmoji: '',
        scope: 'lorem|ipsum',
        type: 'chore',
        issue_type: 'feature',
        root_cause: '',
        fix: ''
      })
    );
    expect(calls[2].firstArg).to.deep.equal(
      updateTokenValues({
        body: '',
        breaking_change: '',
        description: 'test description',
        footer: '',
        gitmoji: '',
        scope: 'lorem|ipsum',
        type: 'chore',
        issue_type: 'feature',
        root_cause: '',
        fix: ''
      })
    );
    expect(calls[3].firstArg).to.deep.equal(
      updateTokenValues({
        body: '',
        breaking_change: 'BREAKING CHANGE',
        description: 'test description',
        footer: '',
        gitmoji: '',
        scope: 'lorem|ipsum',
        type: 'chore',
        issue_type: 'feature',
        root_cause: '',
        fix: ''
      })
    );
    expect(calls[4].firstArg).to.deep.equal(
      updateTokenValues({
        body: '',
        breaking_change: 'BREAKING CHANGE',
        description: 'test description',
        footer: '',
        gitmoji: '',
        scope: 'lorem|ipsum',
        type: 'chore',
        issue_type: 'bug',
        root_cause: '',
        fix: ''
      })
    );
    expect(calls[5].firstArg).to.deep.equal(
      updateTokenValues({
        body: '',
        breaking_change: 'BREAKING CHANGE',
        description: 'test description',
        footer: '',
        gitmoji: '',
        scope: 'lorem|ipsum',
        type: 'chore',
        issue_type: 'bug',
        root_cause: 'No idea man',
        fix: ''
      })
    );
    expect(calls[6].firstArg).to.deep.equal(
      updateTokenValues({
        body: '',
        breaking_change: 'BREAKING CHANGE',
        description: 'test description',
        footer: '',
        gitmoji: '',
        scope: 'lorem|ipsum',
        type: 'chore',
        issue_type: 'bug',
        root_cause: 'No idea man',
        fix: 'Yet to figure out LOL',
      })
    );
    expect(calls[7]).to.be.undefined;
  });

  it('should not display conditionally rendered fields if the condition is not met', async () => {
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
        issue_type: 'feature'
      })
    );

    expect(el.shadowRoot?.querySelector('vscode-multi-select[name="root_cause"]')).to.be.null;
    expect(el.shadowRoot?.querySelector('vscode-multi-select[name="fix"]')).to.be.null;
  });

  it('should display conditionally rendered fields if the condition is met', async () => {
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
        issue_type: 'bug'
      })
    );

    expect(el.shadowRoot?.querySelector('vscode-multi-select[name="root_cause"]')).not.to.be.undefined;
    expect(el.shadowRoot?.querySelector('vscode-multi-select[name="fix"]')).not.to.be.undefined;
  });
});
