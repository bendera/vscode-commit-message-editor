/* eslint-disable no-undef */

const commits = [
  {
    hash: '98106c48a07d4d07f0f71b4db9b3ff156f223339',
    message:
      'No need to create fake workspace folder for query builder\nFix #111348',
    parents: ['3283ade76495ca8feec525fa7378a4300d058db8'],
    authorDate: '2020-12-31T20:18:56.000Z',
    authorName: 'Rob Lourens',
    authorEmail: 'roblourens@gmail.com',
    commitDate: '2020-12-31T20:19:09.000Z',
  },
  {
    hash: '3283ade76495ca8feec525fa7378a4300d058db8',
    message:
      "Don't use 'expandPatterns' for workspaceContains search\nFix #110510",
    parents: ['da4784eaa84648aa42e1eea89a16e3f0584199a6'],
    authorDate: '2020-12-14T02:31:33.000Z',
    authorName: 'Rob Lourens',
    authorEmail: 'roblourens@gmail.com',
    commitDate: '2020-12-31T19:10:10.000Z',
  },
  {
    hash: 'da4784eaa84648aa42e1eea89a16e3f0584199a6',
    message:
      "Don't miss creating a new default terminal\nwhen reconnection is disabled\nFix #113564",
    parents: ['4e7e21233e352a9d5e32b0c9a374acaf776e9593'],
    authorDate: '2020-12-31T19:07:24.000Z',
    authorName: 'Rob Lourens',
    authorEmail: 'roblourens@gmail.com',
    commitDate: '2020-12-31T19:07:32.000Z',
  },
  {
    hash: '4e7e21233e352a9d5e32b0c9a374acaf776e9593',
    message: 'Have `computeSync` return an array of results',
    parents: ['5edb6102629c0b4256b417b25fc2e54f475f2276'],
    authorDate: '2020-12-31T15:37:39.000Z',
    authorName: 'Alexandru Dima',
    authorEmail: 'alexdima@microsoft.com',
    commitDate: '2020-12-31T15:37:39.000Z',
  },
  {
    hash: '5edb6102629c0b4256b417b25fc2e54f475f2276',
    message:
      'Extract all MarkdownHover computation to MarkdownHoverParticipant',
    parents: ['408539d8fa57dd02f6b83d10e2c569b5010b247e'],
    authorDate: '2020-12-31T14:32:39.000Z',
    authorName: 'Alexandru Dima',
    authorEmail: 'alexdima@microsoft.com',
    commitDate: '2020-12-31T14:32:39.000Z',
  },
  {
    hash: '408539d8fa57dd02f6b83d10e2c569b5010b247e',
    message: 'More cleanup',
    parents: ['18982d441bbc810cf7081e6269d01e0eb546bf10'],
    authorDate: '2020-12-31T14:12:11.000Z',
    authorName: 'Alexandru Dima',
    authorEmail: 'alexdima@microsoft.com',
    commitDate: '2020-12-31T14:12:11.000Z',
  },
  {
    hash: '18982d441bbc810cf7081e6269d01e0eb546bf10',
    message: 'Fix compilation error',
    parents: ['d3b643c8a48560a446583887882876cd430f6c02'],
    authorDate: '2020-12-31T14:11:56.000Z',
    authorName: 'Alexandru Dima',
    authorEmail: 'alexdima@microsoft.com',
    commitDate: '2020-12-31T14:11:56.000Z',
  },
  {
    hash: 'd3b643c8a48560a446583887882876cd430f6c02',
    message: ':lipstick:',
    parents: ['923f34a80d167f8c0995e149fc58b03114359d40'],
    authorDate: '2020-12-31T13:44:18.000Z',
    authorName: 'Alexandru Dima',
    authorEmail: 'alexdima@microsoft.com',
    commitDate: '2020-12-31T13:44:18.000Z',
  },
  {
    hash: '923f34a80d167f8c0995e149fc58b03114359d40',
    message: 'Extract `MarkdownHoverParticipant` from the editor hover',
    parents: ['2f817caf6e7b59a299089a2e953ff02688cdc8b7'],
    authorDate: '2020-12-31T13:40:44.000Z',
    authorName: 'Alexandru Dima',
    authorEmail: 'alexdima@microsoft.com',
    commitDate: '2020-12-31T13:40:44.000Z',
  },
  {
    hash: '2f817caf6e7b59a299089a2e953ff02688cdc8b7',
    message: 'Move more marker specific logic to markerHoverParticipant',
    parents: ['28795976207da3930d75f795bac539eb8d0ff590'],
    authorDate: '2020-12-31T10:01:09.000Z',
    authorName: 'Alexandru Dima',
    authorEmail: 'alexdima@microsoft.com',
    commitDate: '2020-12-31T10:01:09.000Z',
  },
];

const config = {
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
        {label: '---', value: ''},
        {
          label: 'build',
          description:
            'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
        },
        {
          label: 'chore',
          description: 'Updating grunt tasks etc; no production code change',
        },
        {
          label: 'ci',
          description:
            'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
        },
        {label: 'docs', description: 'Documentation only changes'},
        {label: 'feat', description: 'A new feature'},
        {label: 'fix', description: 'A bug fix'},
        {
          label: 'perf',
          description: 'A code change that improves performance',
        },
        {
          label: 'refactor',
          description:
            'A code change that neither fixes a bug nor adds a feature',
        },
        {label: 'revert'},
        {
          label: 'style',
          description:
            'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
        },
        {
          label: 'test',
          description: 'Adding missing tests or correcting existing tests',
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
          label: 'lorem',
          description:
            'Example scope',
        },
        {
          label: 'ipsum',
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
          value: '⚡️'
        },
        {
          label: '🔥 fire',
          value: '🔥'
        },
        {
          label: '💚 green_heart',
          value: '💚'
        }
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
      default: false,
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
    visibleViews: 'both',
    showRecentCommits: true,
    saveAndClose: true,
  },
};

const submitFromHostToWebview = (data) => {
  window.postMessage(data);
  console.log('postmessage: host > webview', data);
};

const recentCommitMessages = () => {
  setTimeout(() => {
    submitFromHostToWebview({
      command: 'recentCommitMessages',
      payload: commits,
    });
  }, 2000);
};

const receiveConfig = () => {
  submitFromHostToWebview({
    command: 'receiveConfig',
    payload: config,
  });
};

const repositoryInfo = () => {
  submitFromHostToWebview({
    command: 'repositoryInfo',
    payload: {
      numberOfRepositories: 5,
      selectedRepositoryPath: 'C:/fakepath',
    },
  });
};

const confirmAmend = () => {
  if(config.confirmAmend) {
    if (window.confirm('Are you sure?')) {
      submitFromHostToWebview({
        command: 'amendPerformed'
      });
    }
  } else {
    submitFromHostToWebview({
      command: 'amendPerformed'
    });
  }
}

window.acquireVsCodeApi = () => ({
  postMessage(msg) {
    console.log('postmessage: webview > host', msg);

    switch (msg.command) {
      case 'requestRecentCommits':
        recentCommitMessages();
        break;
      case 'requestConfig':
        receiveConfig();
        repositoryInfo();
        break;
      case 'confirmAmend':
        confirmAmend();
        break;
    }
  },
  setState(state) {
    const encoded = JSON.stringify(state);
    window.localStorage.setItem('__vscodeMockedState__', encoded);
  },
  getState() {
    return JSON.parse(window.localStorage.getItem('__vscodeMockedState__'));
  },
});
