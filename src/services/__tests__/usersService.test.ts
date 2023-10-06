import moxios from 'moxios';

import apiChatloopOrg from '../../config/axiosConfig';

const mockLearner = {
  id: 100582,
  displayName: 'Sara',
  email: 'learner@email.com',
  showNewActivityDrawer: false,
  roles: ['ROLE_LEARNER'],
};

describe('moxios tests', () => {
  beforeEach(() => {
    moxios.install(apiChatloopOrg);
  });
  afterEach(() => {
    moxios.uninstall(apiChatloopOrg);
  });

  test('calls the dispatch on axios response', async () => {
    const action = { type: 'SET_LEARNERS', payload: { users: [mockLearner] } };

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: action,
      });
    });

    // create mock for callback arg
    const mockDispatch = jest.fn();

    // const response = await getLearners(mockDispatch);

    // see whether mock was run with the correct argument
    // expect(mockDispatch).toHaveBeenCalledWith(action);
  });
});
