import { expect } from '@open-wc/testing';
import {formDataChanged} from '../../store/actions';
import {rootReducer, createInitialState} from '../../store/reducers';

suite('reducer', () => {
  test('FORM_DATA_CHANGED', () => {
    const state = createInitialState();
    const action = formDataChanged({
      name: 'test_name',
      value: 'test value',
    });
    const reduced = rootReducer(state, action);

    expect(reduced.tokenValues).to.deep.eq({
      test_name: 'test value'
    });
  });
});
