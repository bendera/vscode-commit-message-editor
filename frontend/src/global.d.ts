import {VSCodeAPI} from './definitions';

declare global {
  function acquireVsCodeApi(): VSCodeAPI;
}
