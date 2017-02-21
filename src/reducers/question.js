import { combineReducers } from 'redux';
import asyncHandler from './asyncHandler';

const questionHandler = asyncHandler('FETCH_QUESTION', null);

export default function(state = {}, action) {
 let newState;

    if (action.type === 'FETCH_QUESTION:OK') {
        newState = Object.assign({}, action.response, state);
    } else {
        newState = state
    }

    const current = questionHandler(newState, action);

    return {
        ...current
    };
}
