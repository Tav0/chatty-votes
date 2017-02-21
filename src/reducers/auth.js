/* Reducer.
 *
 * Internal state is as follows:
 * {
 *      auth:   {
 *          admin:      true/false,
 *          firstname:  ...
 *          lastname:   ...
 *          loadingStatus:   ok/loading/error
 *          register : {
 *              // state returned from POST /api/users
 *          },
 *          updateProfile : {
 *              // state returned from PUT /api/users/1
 *          },
 *      }
 * }
 */
import { loadedObject } from '../util/loadingObject';
import asyncHandler from './asyncHandler';

/* The code below assumes index.html includes a script /api/login
 * which sets 'authState' to a suitable initial value that is either
 * { } or has { id, firstname, lastname, email, username }
 */
/*global authState*/
let initialState = authState;
if ('id' in initialState) {
    // if it's there, we decorate it with the 'loaded' label so that code
    // can check if the user is authenticated doing 'isLoaded(user)'
    initialState = loadedObject(initialState);
}

const loginHandler = asyncHandler('LOGIN', initialState);
const registerHandler = asyncHandler('REGISTER', {});
const updateProfileHandler = asyncHandler('UPDATE_PROFILE', {});
const fetchProfileHandler = asyncHandler('FETCH_PROFILE', {});

export default function(state = initialState, action) {
    let newState;

    debugger;
    if (action.type === 'REGISTER:OK') {
        // after registration, the server response has the user. Place it in auth.
        newState = action.response;
    } else {
        newState = loginHandler(state, action);
        newState = fetchProfileHandler(newState, action);
    }

    const register = registerHandler(state.register, action);
    const updateProfile = updateProfileHandler(state.updateProfile, action);
    return { ...newState, register, updateProfile };
}
