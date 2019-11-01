(function() {
  const elMessageBox = document.getElementById('message-box');
  const elSuccessButton = document.getElementById('success-button-text');
  const elCancelButton = document.getElementById('cancel-button-text');
  const elRecentCommitsWrapper = document.getElementById('recent-commits-wrapper');
  const elRecentCommitsList = document.getElementById('recent-commits-wrapper__commits-list');
  const elLoadTemplateButton = document.getElementById('load-template-button');
  const elEditForm = document.getElementById('edit-form');

  const vscode = acquireVsCodeApi();
  const formBuilder = new FormBuilder();
  let config = {};

  vscode.postMessage({
    command: 'requestConfig'
  });

  const closeTab = () => {
    vscode.postMessage({
      command: 'closeTab',
    });
  };

  const transformCommitList = (commits) => {
    const icons = {
      leaf: 'git-commit',
    };

    data = [];

    commits.forEach((item) => {
      const { message } = item;

      data.push({
        icons,
        label: message,
      });
    });

    return data;
  }

  window.addEventListener('message', event => {
    const { data } = event;

    switch (data.command) {
      case 'copyFromSCMInputBox':
        elMessageBox.value = data.payload.inputBoxValue;
        break;
      case 'recentCommitMessages':
        elRecentCommitsWrapper.classList.remove('is-loading');
        elRecentCommitsList.data = transformCommitList(data.payload.commits);
        break;
      case 'receiveConfig':
        config = { ...data.payload };
        formBuilder.setFields(config.tokens);
        formBuilder.compile();
        formBuilder.appendTo(elEditForm);
        break;
    }
  });

  elSuccessButton.addEventListener('click', event => {
    event.stopPropagation();
    event.preventDefault();

    vscode.postMessage({
      command: 'copyFromExtensionMessageBox',
      payload: elMessageBox.value,
    });
  });

  elCancelButton.addEventListener('click', event => {
    event.stopPropagation();
    event.preventDefault();

    closeTab();
  });

  elRecentCommitsList.addEventListener('vsc-select', (event) => {
    elMessageBox.value = event.detail.value;
  });

  elLoadTemplateButton.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();

    elMessageBox.value = config.template.join('\n');
  });
})();
