import asyncHandler from './asyncHandler';

const questionHandler = asyncHandler('FETCH_QUESTION', null);
const totalVotesHandler = asyncHandler('TOTAL_VOTES', null);
const messagesHandler = asyncHandler('FETCH_MESSAGES', null);
const updateVoteHandler = asyncHandler('UPDATE_VOTE', null);
const sendMessageHandler = asyncHandler('SEND_MESSAGE', null);

export default function(state = {loadingStatus: 'loading'}, action) {
    let newState;

    if (action.type === 'TOTAL_VOTES:OK') {
        newState = Object.assign({}, state, action.response);
    } else if (action.type === 'FETCH_QUESTION:OK') {
        newState = Object.assign({}, state, action.response);
    } else if (action.type === 'FETCH_MESSAGES:OK') {
        newState = Object.assign({}, state, action.response);
    } else if (action.type === 'UPDATE_VOTE:OK') {
        debugger;
        const voteresult = { voteresult: action.response.result };
        newState = Object.assign({}, state, voteresult);
    } else if (action.type === 'SEND_MESSAGE:OK') {
        const result = { result: action.response };
        newState = Object.assign({}, state, result);
    } else {
        newState = Object.assign({}, state, action.response);
    }

    const current = questionHandler(newState, action);
    const totalvotes = totalVotesHandler(newState, action);
    const messages = messagesHandler(newState, action);
    const updatevote = updateVoteHandler(newState, action);
    const sendmessage = sendMessageHandler(newState, action);

    return {
        ...current,
        ...totalvotes,
        ...messages,
        ...updatevote,
        ...sendmessage
    };
};
