import {expect} from '@esm-bundle/chai';
import sinon, { SinonSpy } from 'sinon';
import {getAPI} from '../../utils/VSCodeAPIService';

describe('VSCodeAPIService', () => {
  before(() => {
    window.acquireVsCodeApi = sinon.spy(() => ({
      setState: sinon.fake(),
      getState: sinon.fake(),
      postMessage: sinon.fake(),
    }));
  });

  it('is defined', () => {
    getAPI();
    getAPI();

    expect((window.acquireVsCodeApi as SinonSpy).calledOnce).to.equal(true);
  });
});
