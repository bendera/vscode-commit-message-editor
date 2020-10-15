(function() {
  const elMessageBox = document.getElementById('message-box');
  const elTextSuccessButton = document.getElementById('success-button-text');
  const elTextCancelButton = document.getElementById('cancel-button-text');
  const elTextAmendCheckbox = document.getElementById('text-amend-checkbox');
  const elFormSuccessButton = document.getElementById('success-button-form');
  const elFormCancelButton = document.getElementById('cancel-button-form');
  const elFormAmendCheckbox = document.getElementById('form-amend-checkbox');
  const elRecentCommitsWrapper = document.getElementById('recent-commits-wrapper');
  const elRecentCommitsList = document.getElementById('recent-commits-wrapper__commits-list');
  const elLoadTemplateButton = document.getElementById('load-template-button');
  const elEditForm = document.getElementById('edit-form');
  const elTabs = document.getElementById('main-tabs');

  const vscode = acquireVsCodeApi();
  const formBuilder = new FormBuilder();
  let config = {};
  const prevState = vscode.getState();

  vscode.postMessage({
    command: 'requestConfig'
  });

  const setActiveTab = () => {
    if (prevState && prevState.tabs !== undefined) {
      elTabs.selectedIndex = prevState.tabs;
    }
  }

  const closeTab = () => {
    vscode.postMessage({
      command: 'closeTab',
    });
  };

  const requestRecentCommits = () => {
    vscode.postMessage({
      command: 'requestRecentCommits',
    });
  }

  const getRecentCommits = () => {
    const state = prevState || {};

    if (state.commits) {
      elRecentCommitsWrapper.classList.remove('is-loading');
      elRecentCommitsList.data = transformCommitList(state.commits);
    } else {
      requestRecentCommits();
    }
  }

  const getMessageBoxValue = () => {
    const state = vscode.getState() || {};

    if (state.messageBox) {
      elMessageBox.value = state.messageBox;
    }
  }

  const transformCommitList = (commits) => {
    const icons = {
      leaf: 'git-commit',
    };

    data = [];

    commits.forEach((item) => {
      const { message } = item;
      const lines = message.split('\n');

      data.push({
        icons,
        label: lines[0],
        value: message,
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

  const saveMessageBoxValue = () => {
    const state = vscode.getState() || {};

    state.messageBox = elMessageBox.value;

    vscode.setState(state);
  }

  const buildForm = (tokens) => {
    if (!elEditForm) {
      return;
    }

    formBuilder.setFields(tokens);
    formBuilder.setSaveFieldValueCallback(saveFieldValueCallback);

    if (prevState) {
      formBuilder.setPrevState(prevState.form);
    }

    formBuilder.compile();
    formBuilder.appendTo(elEditForm);
  };

  const prefillInputboxForAmend = () => {
    const state = vscode.getState() || {};

    if (elTextAmendCheckbox && elTextAmendCheckbox.checked && elMessageBox.value === '' && state.commits && state.commits.length > 0) {
      elMessageBox.value = state.commits[0].message;
    }
  }

  const submitMessageToHost = (message, amend) => {
    const command = amend ? 'confirmAmend' : 'copyFromExtensionMessageBox';

    vscode.postMessage({
      command,
      payload: message,
    });
  }

  const copyFromSCMInputBox = (data) => {
    if (!elMessageBox) {
      return;
    }

    elMessageBox.value = data.payload.inputBoxValue;
    saveMessageBoxValue();
  }

  const recentCommitMessages = (data) => {
    if (!elRecentCommitsWrapper || !elRecentCommitsList) {
      return;
    }

    const transformedList = transformCommitList(data.payload.commits);
    const state = vscode.getState() || {};

    elRecentCommitsWrapper.classList.remove('is-loading');
    elRecentCommitsList.data = transformedList;
    state.commits = data.payload.commits;
    vscode.setState(state);
    prefillInputboxForAmend();
  }

  const amendPerformed = () => {
    if (elTextAmendCheckbox) {
      elTextAmendCheckbox.checked = false;
    }

    if (elFormAmendCheckbox) {
      elFormAmendCheckbox.checked = false;
    }
  }

  window.addEventListener('message', event => {
    const { data } = event;

    switch (data.command) {
      case 'copyFromSCMInputBox':
        copyFromSCMInputBox(data);
        break;
      case 'recentCommitMessages':
        recentCommitMessages(data);
        break;
      case 'receiveConfig':
        config = { ...data.payload };
        buildForm(config.tokens);

        if (config.showRecentCommits) {
          getRecentCommits();
        }

        prefillInputboxForAmend();
        break;
      case 'amendPerformed':
        amendPerformed();
      default:
        break;
    }
  });

  if (elTabs) {
    elTabs.addEventListener('vsc-select', (event) => {
      const state = vscode.getState() || {};

      state.tabs = state.tabs || {};
      state.tabs = event.detail.selectedIndex;
      vscode.setState(state);
    });
  }

  if (elMessageBox) {
    elMessageBox.addEventListener('vsc-input', () => {
      saveMessageBoxValue();
    });
  }

  if (elTextSuccessButton) {
    elTextSuccessButton.addEventListener('click', event => {
      event.stopPropagation();
      event.preventDefault();

      submitMessageToHost(elMessageBox.value, elTextAmendCheckbox.checked);

      if (config.saveAndClose) {
        closeTab();
      }
    });
  }

  if (elTextCancelButton) {
    elTextCancelButton.addEventListener('click', event => {
      event.stopPropagation();
      event.preventDefault();

      closeTab();
    });
  }

  elFormSuccessButton && elFormSuccessButton.addEventListener('click', event => {
    event.stopPropagation();
    event.preventDefault();

    const parser = new TemplateParser(elEditForm, config);
    const compiledTemplate = parser.getCompiledTemplate();

    submitMessageToHost(compiledTemplate, elFormAmendCheckbox.checked);

    if (config.saveAndClose) {
      closeTab();
    }
  });

  elFormCancelButton && elFormCancelButton.addEventListener('click', event => {
    event.stopPropagation();
    event.preventDefault();

    closeTab();
  });

  if (elRecentCommitsList) {
    elRecentCommitsList.addEventListener('vsc-select', (event) => {
      elMessageBox.value = event.detail.value;
      saveMessageBoxValue();
    });
  }

  if (elLoadTemplateButton) {
    elLoadTemplateButton.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();

      elMessageBox.value = config.staticTemplate.join('\n');
      saveMessageBoxValue();
    });
  }

  if (elTextAmendCheckbox) {
    elTextAmendCheckbox.addEventListener('vsc-change', () => {
      prefillInputboxForAmend();
    });
  }

  setActiveTab();
  getMessageBoxValue();
})();
