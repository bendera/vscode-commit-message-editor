let api: VSCodeAPI;

export const getAPI = (): VSCodeAPI => {
  if (!api) {
    api = window.acquireVsCodeApi();
  }

  return api;
};
