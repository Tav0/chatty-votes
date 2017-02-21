import { APIResource, buildURL } from './resource.js';

export function getMessages({qid}) {
    return new APIResource(buildURL(`/chat/${qid}`)).get()
}

export function sendMessage({qid, msg}) {
    return new APIResource(buildURL(`/chat/${qid}`)).post({message: msg});
}
