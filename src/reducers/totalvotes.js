import { combineReducers } from 'redux';
import asyncHandler from './asyncHandler';

const totalVotesHandler = asyncHandler('TOTAL_VOTES', null);

export default function(state = {}, action) {
 let newState;

    if (action.type === 'TOTAL_VOTES:OK') {
        newState = Object.assign({}, action.response, state);
    }
    else { newState = state}
 
    const totalvotes = totalVotesHandler(newState, action);

    return {
        ...totalvotes
    };
}
