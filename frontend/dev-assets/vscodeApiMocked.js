/* eslint-disable no-undef */
window.acquireVsCodeApi = () => ({
  postMessage(msg) {
    console.log('postmessage', msg);
  },
});
