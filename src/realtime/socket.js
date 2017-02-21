import store from '../store';
import {totalVotes} from '../actions/questions.js';
import { getMessages } from '../actions/chat.js';

const io = require('socket.io-client');  // uses stand-alone build
const config = require('../config/');
import toastr from 'toastr';

const socket = io(config.default.socketIoUrl, { path: `${config.default.publicUrl}/api/socket.io` });
 
socket.on('connect', () => { console.log('socket:connect'); });
socket.on('disconnect', () => { console.log('socket:disconnect'); });

const voteSocket = io.connect(config.default.socketIoUrl + "/votes",
    { path: `${config.default.publicUrl}/api/socket.io` });

voteSocket.on('voteupdate', (response) => {
    console.log(response);
    toastr.success(`${response.results.user.username} just voted`);
    store.dispatch({
        response: response.results,
        type: 'UPDATE_VOTE:OK'
    })
})

export function subscribeToVotesForQuestion(qid) {
    voteSocket.emit('subscribe', {qid});
}

export function unSubscribeToVotesForQuestion(qid) {
    voteSocket.emit('unsubscribe', {qid});
}

const questionchatSocket = io.connect(config.default.socketIoUrl + "/questionchat",
    { path: `${config.default.publicUrl}/api/socket.io` });

questionchatSocket.on('questionchatupdate', (response) => {
    console.log(response);
    store.dispatch({
        response: response.results,
        type: 'SEND_MESSAGE:OK'
    });
});

export function subscribeToChatForQuestion(qid) {
    questionchatSocket.emit('subscribe', {qid});
}

export function unSubscribeToChatForQuestion(qid) {
    questionchatSocket.emit('unsubscribe', {qid});
}

module.exports = { subscribeToVotesForQuestion, unSubscribeToVotesForQuestion, socket, voteSocket, subscribeToChatForQuestion, unSubscribeToChatForQuestion, questionchatSocket };
