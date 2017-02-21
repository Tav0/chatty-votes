import { combineReducers } from 'redux';
import asyncHandler from './asyncHandler';

const listQuestionsHandler = asyncHandler('FETCH_QUESTIONS_LIST', null);

export default function(state = {}, action) {
 let newState;

    if (action.type === 'FETCH_QUESTIONS_LIST:OK') {
        newState = action.response;
     }
    else {
        newState = state
    }

    const questions = listQuestionsHandler(newState, action);

    return {
        ...newState,
        ...questions
    };    
}
