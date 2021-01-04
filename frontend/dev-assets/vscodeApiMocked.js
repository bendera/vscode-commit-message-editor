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


/* eslint-disable no-undef */
window.acquireVsCodeApi = () => ({
  postMessage(msg) {
    console.log('postmessage', msg);

    switch(msg.command) {
      case 'requestRecentCommits':
        setTimeout(() => {
          window.postMessage({
            command: 'recentCommitMessages',
            payload: {
              commits,
            },
          });
        }, 2000);
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
