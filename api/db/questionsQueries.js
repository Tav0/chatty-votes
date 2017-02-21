const Promise = require('bluebird') // override ES6 Promise to be able to use '.using'
const dbConn = require('./connection')

function getQuestionById(qid, id) { 
    return new Promise((fulfill, reject) => {
        const quest = Promise.using(dbConn.get(), (conn) => {
            const query = `
                SELECT * FROM questions
                WHERE qid = ?
            `
            return conn.query(query, [qid]);
        })

        const answer = Promise.using(dbConn.get(), (conn) => {
            const query = `
                SELECT * FROM answers
                WHERE qid = ?
            `
            return conn.query(query, [qid]);
        })

        const vote = Promise.using(dbConn.get(), (conn) => {
            const query = `
                SELECT * FROM surveyvotes
                WHERE (uid = ? AND qid = ?)
            `
            return conn.query(query, [id, qid]);
        })

        const surveyvotes = Promise.using(dbConn.get(), (conn) => {
            const query = `
                SELECT * FROM surveyvotes   
                WHERE qid = ?
                ORDER BY aid
            `
            return conn.query(query, [qid]);
        })

        Promise.all([quest, answer, vote, surveyvotes]).then((results) => {
            let question = results[0];
            question = question[0];
            const choices = results[1];
            let values = []
            let vote = results[2];
            vote = vote[0];
            let temp = [];
            for (choice of choices) {
                values.push({id: choice.id, description: choice.description});
                if (vote && vote.aid == choice.id) {
                    temp.push(vote.aid);
                }
            }
            let votes = results[3];
            let surveyvotes = [];
            
            //what is this?
            for (votee in votes) {
                
            }
            
 
            fulfill({question: {id: question.qid, question: question.question, description: question.description, type: question.type, choices: values}, vote: temp});
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function createQuestion({question, type, description, choices, qid}, uid) {
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {
            const query = `
                INSERT INTO questions SET ?
            `
            return conn.query(query, {qid: qid, question: question, type: type, description: description, uid: uid});
        })
        .then((result) => {
            const temp = Promise.using(dbConn.get(), (conn) => {
                const query = `
                    INSERT INTO answers (description, qid) VALUES ?
                `
                let values = []
                for (choice of choices) {
                    let temp = []
                    temp.push(choice);
                    temp.push(result.insertId);
                    values.push(temp);
                }
                return conn.query(query, [values]);
            })
            .then((result2) => {
                fulfill(result);
            })
            .catch((err) => {
                reject(err);
            })
        })
        .catch((err) => {
            reject(err);
        })
    })
}

//question is a an object with one or more fields
function updateQuestion(qid, question) {
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {
            const query = `
                UPDATE questions SET ?
                WHERE qid = ?
            `
            return conn.query(query, [question, qid]);
        })
        .then((result) => {
            if (!result) {
                reject("could not find question");
            }
            fulfill(result);
        })
        .catch((err) => {
            reject("Update Error");
        })
    })
}

function removeQuestion(qid) {
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {
            const query = `
                DELETE FROM surveyvotes
                WHERE qid = ?
            `
            return conn.query(query, [qid]);
        })
        .then((result) => {
            Promise.using(dbConn.get(), (conn) => {
                const query = `
                    DELETE FROM answers
                    WHERE qid = ?
                `
                return conn.query(query, [qid]);
            })
            .then((result) => {
                Promise.using(dbConn.get(), (conn) => {
                    const query = `
                        DELETE FROM questions
                        WHERE qid = ?
                    `
                    return conn.query(query, [qid]);
                })
                .then((result2) => {
                    fulfill(result2);
                })
                .catch((err) => {
                    reject(err);
                })
            })
            .catch((err) => {
                reject("delete error");
            })
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function listQuestions(page, pgSize = 10) {
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {
            return conn.query('SELECT * FROM questions ')
        })
        .then((questions1) => {
            if (!questions1) {
                reject("Could not find questions");
            }
            results = [];
            for (let i = 0; i < 10; i++) {
                if (questions1[page * pgSize + i] != undefined) {
                    const questionn = questions1[page * pgSize + i];
                    const apiResult = {qid: questionn.qid, question: questionn.question, type: questionn.type, description: questionn.description, uid: questionn.uid}
                    results.push(apiResult);
                }
            }
            let hasMore = false;
            if (page * pgSize + 10 <= questions1.length) {
                hasMore = true;
            }
            fulfill({has_more: hasMore, questions: results});
        })
        .catch((err) => {
            reject("Database Error");
        })
    })
}

function removeVote(id, qid) {
    let ids;
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {
            const query = `
                DELETE FROM surveyvotes
                WHERE (qid = ? and uid = ?)
            `
            return conn.query(query, [qid, id]);
        })
        .then((result) => {
            fulfill(result);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function castVote(uid, aid, qid) {
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {
            const query = `
                INSERT INTO surveyvotes SET ?
            `
            return conn.query(query, {uid: uid, aid: aid, qid: qid});
        })
        .then((result) => {
            fulfill(qid);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function totalVotes(qid) {
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {
            const query = `SELECT DISTINCT answers.description, COUNT(surveyvotes.aid) AS count 
                           FROM answers, surveyvotes
                           WHERE surveyvotes.qid = ? AND surveyvotes.aid = answers.id
                           GROUP BY answers.description`

            return conn.query(query, qid);
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
    getQuestionById,
    createQuestion,
    updateQuestion,
    removeQuestion,
    listQuestions,
    removeVote,
    castVote,
    totalVotes
}
