import api from '../api';
import apiAction from './apiAction';

// this function is an "action creator"
// the action created, however, is a thunk.
// see apiAction.js
export function login(username, password) {
  return apiAction({
    baseType: 'LOGIN',
    fetch() {
      return api.auth.login({ username, password });
    },
    onSuccess(dispatch, data, getState) {
        console.log("logging in!");
    },
  });
}

