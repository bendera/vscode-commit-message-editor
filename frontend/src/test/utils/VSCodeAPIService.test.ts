// import {assert} from 'chai';
import {expect} from '@open-wc/testing';
import {getAPI} from '../../utils/VSCodeAPIService';

const assert = chai.assert;

suite('VSCodeAPIService', () => {
  test('is defined', () => {
    const vscode = getAPI();

    assert.isObject(vscode);
    vscode.setState({messageBox: 'test'});
    expect(vscode.getState()).to.deep.eq({
      messageBox: 'test',
    });
  });
});
