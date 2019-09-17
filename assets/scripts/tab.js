const elMessageBox = document.getElementById('message-box');
const elEditForm = document.getElementById('edit-form');
const elSuccessButton = document.getElementById('success-button');

window.addEventListener('message', (event) => {
    const { data } = event;

    switch (data.command) {
        case 'copyFromSCMInputBox':
            elMessageBox.innerHTML = data.payload.inputBoxValue;
            break;
    }
});

(function () {
    const vscode = acquireVsCodeApi();

    elSuccessButton.addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();

        vscode.postMessage({
            command: 'copyFromExtensionMessageBox',
            payload: elMessageBox.value,
        });
    });
})();