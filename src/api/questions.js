import { APIResource, buildURL } from './resource.js';

export function listQuestions({page}) {
    const thispage = page;
    return new APIResource(buildURL(`/questions?page=${thispage}`)).get()
}

export function removeQuestion(qid) {
    return new APIResource(buildURL(`/questions/${qid}`)).delete()
}

export function createQuestion({question, description, choices}) {
    return new APIResource(buildURL('/questions')).post({question: question, description: description, choices: choices}
    );
}

export function getquestion(qid) {
    return new APIResource(buildURL(`/questions/${qid}`)).get();
}

export function updatevote({nextVote, prevVote, qid}) {
    return new APIResource(buildURL('/questions/vote')).post({nextVote, prevVote, qid});
}

export function editquestion({qid, question, description, type, choices}) {
    return new APIResource(buildURL(`/questions/${qid}`)).put({qid, question, description, type, choices}
    );
} 

export function totalVotes(qid) {
    return new APIResource(buildURL(`/questions/${qid}/votes`)).get();
}
