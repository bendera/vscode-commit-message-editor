interface VSCodeAPI {
  postMessage: (message: any) => void;
}

declare function acquireVsCodeApi(): VSCodeAPI;
