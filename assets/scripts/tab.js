(function() {
  const elMessageBox = document.getElementById('message-box');
  const elTextSuccessButton = document.getElementById('success-button-text');
  const elTextCancelButton = document.getElementById('cancel-button-text');
  const elFormSuccessButton = document.getElementById('success-button-form');
  const elFormCancelButton = document.getElementById('cancel-button-form');
  const elRecentCommitsWrapper = document.getElementById('recent-commits-wrapper');
  const elRecentCommitsList = document.getElementById('recent-commits-wrapper__commits-list');
  const elLoadTemplateButton = document.getElementById('load-template-button');
  const elEditForm = document.getElementById('edit-form');

  const vscode = acquireVsCodeApi();
  const formBuilder = new FormBuilder();
  let config = {};
  const prevState = vscode.getState();

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

  const saveFieldValueCallback = (name, value) => {
    const newState = vscode.getState() || {};

    newState.form = newState.form || {};
    newState.form[name] = value;

    vscode.setState(newState);
  };

  const buildForm = (tokens) => {
    formBuilder.setFields(tokens);
    formBuilder.setSaveFieldValueCallback(saveFieldValueCallback);

    if (prevState) {
      formBuilder.setPrevState(prevState.form);
    }

    formBuilder.compile();
    formBuilder.appendTo(elEditForm);
  };

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
        buildForm(config.tokens);
        break;
    }
  });

  elTextSuccessButton.addEventListener('click', event => {
    event.stopPropagation();
    event.preventDefault();

    vscode.postMessage({
      command: 'copyFromExtensionMessageBox',
      payload: elMessageBox.value,
    });
  });

  elTextCancelButton.addEventListener('click', event => {
    event.stopPropagation();
    event.preventDefault();

    closeTab();
  });

  elFormSuccessButton.addEventListener('click', event => {
    event.stopPropagation();
    event.preventDefault();

    const parser = new TemplateParser(elEditForm, config);

    vscode.postMessage({
      command: 'copyFromExtensionMessageBox',
      payload: parser.getCompiledTemplate(),
    });
  });

  elFormCancelButton.addEventListener('click', event => {
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
