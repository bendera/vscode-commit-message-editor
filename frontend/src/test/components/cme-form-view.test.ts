import {expect} from '@open-wc/testing';
import {FormView} from '../../components/cme-form-view';
import store from '../../store/store';
import {receiveConfig} from '../../store/actions';

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
        <vscode-form-item>
          <vscode-form-label>Test label</vscode-form-label>
          <vscode-form-description>
            Test description
          </vscode-form-description>
          <vscode-form-control>
            <vscode-inputbox data-name="test_name" value="" multiline></vscode-inputbox>
          </vscode-form-control>
        </vscode-form-item>
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
        <vscode-form-item>
          <vscode-form-label>Test label</vscode-form-label>
          <vscode-form-description>
            Test description
          </vscode-form-description>
          <vscode-form-control>
            <vscode-single-select
              aria-expanded="false"
              data-name="test_name"
              role="listbox"
              tabindex="0"
            >
              <vscode-option>Lorem</vscode-option>
              <vscode-option value="ipsum">Ipsum</vscode-option>
              <vscode-option value="dolor" description="foo bar">Dolor</vscode-option>
            </vscode-single-select>
          </vscode-form-control>
        </vscode-form-item>
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
        <vscode-form-item>
          <vscode-form-label>Test label</vscode-form-label>
          <vscode-form-description>
            Test description
          </vscode-form-description>
          <vscode-form-control>
            <vscode-checkbox
              label="Test label"
              data-name="test_name"
              tabindex="0"
              value="undefined"
            ></vscode-checkbox>
          </vscode-form-control>
        </vscode-form-item>
      `);
    });
  });
});
