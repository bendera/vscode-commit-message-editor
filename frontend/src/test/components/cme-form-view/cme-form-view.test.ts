import {expect} from '@open-wc/testing';
import {FormView} from '../../../components/cme-form-view/cme-form-view';
import store from '../../../store/store';
import {receiveConfig} from '../../../store/actions';

const createConfig = (): ExtensionConfig => ({
  confirmAmend: false,
  dynamicTemplate: [],
  staticTemplate: [],
  tokens: [],
  view: {
    defaultView: 'form',
    saveAndClose: false,
    showRecentCommits: false,
    visibleViews: 'both',
    visibleLines: 10,
    fullWidth: false,
    rulers: [],
    useMonospaceEditor: false,
    tabSize: 4,
    useTabs: false,
  },
});

describe('cme-form-view', () => {
  it('is defined', () => {
    const el = document.createElement('cme-form-view');
    expect(el).to.instanceOf(FormView);
  });

  describe('form generation', () => {
    let el: FormView | undefined;

    beforeEach(() => {
      el = document.createElement('cme-form-view') as FormView;
      document.body.appendChild(el);
    });

    afterEach(() => {
      document.body.removeChild(el as FormView);
      el = undefined;
    });

    it('renders text type token', async () => {
      const config = createConfig();
      config.tokens = [
        {
          label: 'Test label',
          name: 'test_name',
          type: 'text',
          description: 'Test description',
          multiline: true,
        },
      ];
      const action = receiveConfig(config);

      store.dispatch(action);

      await el?.updateComplete;

      expect(el?.shadowRoot?.querySelector('#edit-form')).lightDom.to.eq(`
        <vscode-form-container id="form-container">
          <vscode-form-group variant="settings-group">
            <vscode-label>Test label</vscode-label>
            <vscode-form-helper>
              Test description
            </vscode-form-helper>
            <vscode-inputbox
              data-name="test_name"
              name="test_name"
              value=""
              multiline
              style="width: 100%;"
            ></vscode-inputbox>
          </vscode-form-group>
        </vscode-form-container>
      `);
    });

    it('renders enum type token', async () => {
      const config = createConfig();
      config.tokens = [
        {
          label: 'Test label',
          name: 'test_name',
          type: 'enum',
          options: [
            {label: 'Lorem'},
            {label: 'Ipsum', value: 'ipsum'},
            {label: 'Dolor', value: 'dolor', description: 'foo bar'},
          ],
          description: 'Test description',
          multiline: true,
        },
      ];
      const action = receiveConfig(config);

      store.dispatch(action);

      await el?.updateComplete;

      expect(el?.shadowRoot?.querySelector('#edit-form')).lightDom.to.eq(`
        <vscode-form-container id="form-container">
          <vscode-form-group variant="settings-group">
            <vscode-label>Test label</vscode-label>
            <vscode-form-helper>
              Test description
            </vscode-form-helper>
            <vscode-single-select
              aria-expanded="false"
              class="vscode-select"
              data-name="test_name"
              name="test_name"
              role="listbox"
              tabindex="0"
            >
              <vscode-option>Lorem</vscode-option>
              <vscode-option value="ipsum">Ipsum</vscode-option>
              <vscode-option value="dolor" description="foo bar">Dolor</vscode-option>
            </vscode-single-select>
          </vscode-form-group>
        </vscode-form-container>
      `);
    });

    it('renders boolean type token', async () => {
      const config = createConfig();
      config.tokens = [
        {
          label: 'Test label',
          name: 'test_name',
          type: 'boolean',
          description: 'Test description',
        },
      ];
      const action = receiveConfig(config);

      store.dispatch(action);

      await el?.updateComplete;

      expect(el?.shadowRoot?.querySelector('#edit-form')).lightDom.to.eq(`
        <vscode-form-container id="form-container">
          <vscode-form-group variant="settings-group">
            <vscode-label>Test label</vscode-label>
            <vscode-form-helper>
              Test description
            </vscode-form-helper>
            <vscode-checkbox
              checked
              data-name="test_name"
              label="Test label"
              name="test_name"
              tabindex="0"
              value=""
            >
          </vscode-form-group>
        </vscode-form-container>
      `);
    });
  });
});
