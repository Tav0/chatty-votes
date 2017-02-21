import asyncHandler from './asyncHandler';

const listQuestionsHandler = asyncHandler('FETCH_QUESTIONS_LIST', null);

export default function(state = {}, action) {
    let newState;

    if (action.type === 'FETCH_QUESTIONS_LIST:OK') {
        newState = action.response;
    }

    const questions = listQuestionsHandler(newState, action);

    return {
        ...questions,
    };
};
