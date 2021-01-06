// import {assert} from 'chai';
import {expect} from '@open-wc/testing';
import { RootState } from '../../store/store';
import {getAPI} from '../../utils/VSCodeAPIService';

const assert = chai.assert;

suite('VSCodeAPIService', () => {
  test('is defined', () => {
    const state: RootState = {
      persisted: false,
      config: {
        confirmAmend: false,
        dynamicTemplate: ['test dynamic template'],
        staticTemplate: ['test static template'],
        tokens: [],
        view: {
          defaultView: 'form',
          saveAndClose: false,
          showRecentCommits: false,
          visibleViews: 'both',
        },
      },
      scmInputBoxValue: '',
      recentCommits: undefined,
      recentCommitsLoading: false,
      textareaValue: '',
    }
    const expected = {...state};

    const vscode = getAPI();

    assert.isObject(vscode);
    vscode.setState(state);
    expect(vscode.getState()).to.deep.eq(expected);
  });
});
