import api from '../api';
import apiAction from './apiAction';
import { browserHistory } from 'react-router';

export function getMessages({qid}) {
    return apiAction({
        baseType: 'FETCH_MESSAGES',
        fetch() {
            return api.chat.getMessages({qid});
        },
        onSuccess(dispatch, data, getState) {
            console.log("Success in fetching messages");
            console.log("Messages: " + JSON.stringify(data));
        }
    });
}

export function sendMessage({qid, msg}) {
    return apiAction({
        baseType: 'SEND_MESSAGE',
        fetch() {
            return api.chat.sendMessage({qid, msg});
        },
        onSuccess(dispatch, data, getState) {
            console.log("Success in sending message");
        }
    });
}
