import { combineReducers } from 'redux';
import asyncHandler from './asyncHandler';

/* Implements a reducer for the admin:* level in the store. 
 * We just store the straight API response.
 */
const listUserHandler = asyncHandler('FETCH_USER_LIST', null);

export default combineReducers({
  userlist: listUserHandler,
});
