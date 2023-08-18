import { VSCodeAPI } from "../definitions";

let api: VSCodeAPI;

export const getAPI = (): VSCodeAPI => {
  if (!api) {
    api = acquireVsCodeApi();
  }

  return api;
};
