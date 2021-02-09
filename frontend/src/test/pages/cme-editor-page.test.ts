import {expect, fixture, html, nextFrame} from '@open-wc/testing';
import sinon, {SinonSandbox, SinonSpy} from 'sinon';
import store from '../../store/store';
import {EditorPage} from '../../pages/cme-editor-page';

describe('cme-editor-page', () => {
  const setState = sinon.fake();
  const getState = sinon.fake();

  before(() => {
    window.acquireVsCodeApi = sinon.spy(() => ({
      setState: setState,
      getState: getState,
      postMessage: sinon.fake(),
    }));
  });

  it('is defined', () => {
    const el = document.createElement('cme-editor-page');
    expect(el).to.instanceOf(EditorPage);
  });

  it('should render an editor instance', async () => {
    const el: EditorPage = await fixture(html`<cme-editor-page></cme-editor-page>`);

    expect(el).shadowDom.to.equal('<cme-editor></cme-editor>');
  });

  describe('handle postmessages', () => {
    let el: EditorPage | undefined;
    let sandbox: SinonSandbox;

    beforeEach(() => {
      el = document.createElement('cme-editor-page') as EditorPage;
      document.body.appendChild(el);

      sandbox = sinon.createSandbox();
      sandbox.spy(store, 'dispatch');
    });

    afterEach(() => {
      document.body.removeChild(el as EditorPage);
      el = undefined;

      sandbox.restore();
    });

    it('should dispatch a "RECEIVE_CONFIG" action when a "receiveConfig" command is received', async () => {
      window.postMessage(
        {
          command: 'receiveConfig',
          payload: {
            confirmAmend: false,
            dynamicTemplate: ['test dynamic template'],
            staticTemplate: ['test static template'],
            tokens: [],
            view: {
              defaultView: 'form',
              saveAndClose: false,
              showRecentCommits: false,
              visibleViews: 'both',
            },
          },
        },
        window.origin
      );

      await nextFrame();

      const receivedConfig = store.getState().config;

      expect(receivedConfig.dynamicTemplate.join('')).to.be.equal(
        'test dynamic template'
      );
      expect(receivedConfig.staticTemplate.join('')).to.be.equal(
        'test static template'
      );
    });

    it('should dispatch a "CLOSE_TAB" action when an "amendPerformed" command is received and the "saveAndClose" config flag is true', async () => {
      window.postMessage(
        {
          command: 'receiveConfig',
          payload: {
            confirmAmend: false,
            dynamicTemplate: [],
            staticTemplate: [],
            tokens: [],
            view: {
              defaultView: 'form',
              saveAndClose: true,
              showRecentCommits: false,
              visibleViews: 'both',
            },
          } as ExtensionConfig,
        },
        window.origin
      );

      await nextFrame();

      window.postMessage(
        {
          command: 'amendPerformed',
        },
        window.origin
      );

      await nextFrame();

      expect((store.dispatch as SinonSpy).args[2]).to.deep.equal([
        {type: 'CLOSE_TAB', payload: undefined},
      ]);
    });

    it('should dispatch a "RECENT_COMMITS_RECEIVED" action when a "recentCommitMessages" command is received', async () => {
      window.postMessage(
        {
          command: 'recentCommitMessages',
          payload: [
            {
              hash: 'Test commit hash',
              message: 'Test commit message',
              parents: ['Test commit parent commit hash'],
              authorDate: 'Test commit author date',
              authorName: 'Test commit author name',
              authorEmail: 'Test commit author email',
              commitDate: 'Test commit date',
            },
          ] as Commit[],
        },
        window.origin
      );

      await nextFrame();

      const recentCommits = store.getState().recentCommits;

      expect(recentCommits).to.deep.equal([
        {
          hash: 'Test commit hash',
          message: 'Test commit message',
          parents: ['Test commit parent commit hash'],
          authorDate: 'Test commit author date',
          authorName: 'Test commit author name',
          authorEmail: 'Test commit author email',
          commitDate: 'Test commit date',
        },
      ]);
    });

    it('should dispatch a "COPY_FROM_SCM_INPUTBOX" action when a "copyFromSCMInputBox" command is received', async () => {
      window.postMessage(
        {
          command: 'copyFromSCMInputBox',
          payload: 'Test commit message',
        },
        window.origin
      );

      await nextFrame();

      const {textareaValue} = store.getState();

      expect(textareaValue).to.eq('Test commit message');
    });
  });
});
