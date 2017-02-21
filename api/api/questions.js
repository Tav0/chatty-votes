const express = require('express');
const queries = require('../db/queries');
const questions = require('../db/questionsQueries');
const chat = require('../db/chat');
const passport = require('passport');
const bcrypt = require('bcrypt');
const redis = require('redis');
const redisClient = redis.createClient();

var LocalStrategy = require('passport-local').Strategy;

var apirouter = express.Router();

passport.serializeUser(function(user, done) {
    done(null, {id: user.id, admin: user.admin, username: user.username});
});

passport.deserializeUser(function(user, done) {
        if (user) {
            queries.getUserById(user.id)
                .then((results) => {
                    done(null, results);
                })
                .catch((err) => {
                    done(err);
                });
        } else {
            done(null, false);
        }
});

passport.use('local', new LocalStrategy(
    function(username, password, done) {
       queries.getUserByName(username)
            .then((result) => {
                if (bcrypt.compareSync(password, result.password)) {
                    return done(null, result);
                }
                else {
                    return done(null, false);
                }
            })
            .catch((err) => {
                return done(err);
            })
    }));

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(403).json({message: "user not authenticated"});
    }
}

apirouter.route('/')
    .get(isLoggedIn, function(req, res, next) {
        if (req.query.page == undefined) {
            questions.listQuestions(0)
                .then((results) => {
                    return res.status(200).send(results);
                })
                .catch((err) => {
                    return res.status(401).json({error: err});  
                })
        }
        else {
            questions.listQuestions(req.query.page)
                .then((results) => {
                    return res.status(200).send(results);
                })
                .catch((err) => {
                    return res.status(402).json( {error: err} );
                })
        }
    })

    .post(isLoggedIn, function(req, res, next) {
        if (req.user.admin == 1) {
            questions.createQuestion({qid: req.body.qid, question: req.body.question, type: 1, description: req.body.description, choices: req.body.choices}, req.user.id)
                .then((result) => {
                    res.status(200).json(result);
                })
                .catch((err) => {
                    res.status(409).json({error: err, message: "Another user already has that username. Choose another!"});
                 })
        }
        else {
            return res.status(403).json("not authenticated");
        }
    });

apirouter.route('/:qid')
    .put(isLoggedIn, function(req, res, next) {
        if (req.user.admin == 1) { 
            questions.removeQuestion(req.params.qid)
                .then((result) => {
                    questions.createQuestion(req.body, req.user.id)
                    .then((result) => {
                        questions.getQuestionById(req.params.qid)
                        .then( (result) => {
                            return res.status(200).json(result);
                        })
                        .catch( (err) => {
                            return res.status(404).json(err);
                        });
                    })
                    .catch((err) => {
                        return res.status(404).json({error: err, message: "update didn't work"});
                    })
                })
                .catch((err) => {
                    return res.status(404).json({error: err, message: "update didn't work"});
                })
        }
        else {
            return res.status(403).json("user not an admin");
        }
    })

    .get(isLoggedIn, function(req, res, next) {
        questions.getQuestionById(req.params.qid, req.user.id)
            .then((result) => {
                return res.status(200).json(result);
            })
            .catch((err) => {
                return res.status(404).json({error: err, message: "could not retrieve question"});
            })
    })

    .delete(isLoggedIn, function(req, res, next) {
        if (req.user.admin == 1) {
            questions.removeQuestion(req.params.qid)
                .then((result) => {
                    res.status(200).json(result);
                })
                .catch((err) => {
                    res.status(404).json({error: err});
                })
        }
        else {
            res.status(403).json({message: "not authenticated"});
        }
    });

apirouter.route('/vote')
    .post(isLoggedIn, function(req, res, next) {
        questions.removeVote(req.user.id, req.body.qid)
        .then((result) => {
            questions.castVote(req.user.id, req.body.nextVote, req.body.qid)
                .then((result) => {
                    questions.totalVotes(req.body.qid)
                    .then((result) => {
                        const voteRedisChannel = 'socket.io#/votes#';
                        const newResult = {result: result, user: req.user}
                        redisClient.publish(`${voteRedisChannel}${req.body.qid}`, JSON.stringify(newResult));
                        res.status(200).json(newResult);
                    })
                    .catch((err) => {
                        res.status(404).json(err);
                    })
                })
                .catch((err) => {
                    res.status(404).json({error: err});
                })
        })
        .catch((err) => {
            res.status(404).json({error:err});
        })
    });

// Gets the total number of votes for each answer choice
apirouter.route('/:qid/votes')
    .get(isLoggedIn, function(req, res, next) {
        const qid = req.params.qid;

        questions.totalVotes(qid)
            .then((result) => {
                res.status(200).json({voteresult: result});
            })
            .catch((err) => {
                res.status(404).json({ error: err });
            })
    })

module.exports = apirouter
