import { combineReducers } from 'redux';
import asyncHandler from './asyncHandler';

const messagesHandler = asyncHandler('FETCH_MESSAGES', null);

export default function(state = {}, action) {
 let newState;

    if (action.type === 'FETCH_MESSAGES:OK') {
        newState = Object.assign({}, action.response, state);
    } else {
        newState = state
    }

    const messages = messagesHandler(newState, action);

    return {
        ...messages
    };
}
