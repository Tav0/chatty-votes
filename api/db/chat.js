const Promise = require('bluebird') // override ES6 Promise to be able to use '.using'
const dbConn = require('./connection')

function getQuestionChat(id) {
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {  
            const query = `
                SELECT * FROM questionchat
                WHERE id = ?
            `
            return conn.query(query, [id]);
        })
        .then((result) => {
            fulfill(result[0]);           
        })
        .catch((err) => {
            reject(err);
        })
    })    
}

function getQuestionChatByQid(qid) {
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {  
            const query = `
                SELECT * FROM questionchat
                WHERE qid = ?
                ORDER BY id DESC
            `
            return conn.query(query, [qid]);
        })
        .then((result) => {
            fulfill(result);           
        })
        .catch((err) => {
            reject(err);
        })
    })    
}

function newMessage({qid, uid, message, username}) {
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {
            const query = `
                INSERT INTO questionchat SET ?
            `
            return conn.query(query, {qid: qid, uid: uid, message: message, username: username});
        })
        .then((result) => {
            fulfill(result);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function removeQuestionChat(qid) {
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {
            const query = `
                DELETE FROM questionchat
                WHERE qid = ?
            `
            return conn.query(query, [qid]);
        })
        .then((result) => {
            fulfill(result);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

module.exports = {
    getQuestionChat,
    getQuestionChatByQid,
    newMessage,
    removeQuestionChat
}
