import api from '../api';
import apiAction from './apiAction';
import { browserHistory } from 'react-router';

export function listquestions({page}) {
    return apiAction({
        baseType: 'FETCH_QUESTIONS_LIST',
        fetch() {
            return api.questions.listQuestions({page});
        },
        onSuccess(dispatch, data, getState) {
            console.log("Success in fetching questions");
        }
    });
}

export function removeQuestion(qid, success) {
    return apiAction({
        baseType: 'REMOVE_QUESTION',
        fetch() {
            return api.questions.removeQuestion(qid);
        },
        onSuccess(dispatch, data, getState) {
            console.log("success in deletion of question");
            success();
        }
    });
}

export function createQuestion({question, description, choices}) {
    return apiAction({
        baseType: 'POST_NEW_QUESTION',
        fetch() {
            return api.questions.createQuestion({question, description, choices});
        },
        onSuccess(dispatch, data, getState) {
            console.log("Successfully created new question");
            browserHistory.replace(`questions/${data.insertId}`);
        }
    });
}

export function getquestion(qid) {
    return apiAction({
        baseType: 'FETCH_QUESTION',
        fetch() {
            return api.questions.getquestion(qid)
        },
        onSuccess(dispatch, data, getState) {
            console.log("successfully fetched question!");
        }
    });
}

export function updatevote({nextVote, prevVote, qid}) {
    return apiAction({
        baseType: 'UPDATE_VOTE',
        fetch() {
            return api.questions.updatevote({nextVote, prevVote, qid});
        },
        onSuccess(dispatch, data, getState) {
            console.log("update successfull");
        }
    });
}

export function editquestion({qid, question, description, type,  choices}) {
    return apiAction({
        baseType: 'EDIT_QUESTION',
        fetch() {
            return api.questions.editquestion({qid, question, description, type, choices});
        },
        onSuccess(dispatch, data, getState) {
            console.log("Successfully edited question");
            browserHistory.replace(`/questions/${qid}`);
        }
    });
}

export function totalVotes(qid) {
    return apiAction({
        baseType: 'TOTAL_VOTES',
        fetch() {
            return api.questions.totalVotes(qid);
        },
        onSuccess(dispatch, data, getState) {
            console.log("Got total votes success");
        }
    });
}
