const express = require('express');
const queries = require('../db/queries');
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

apirouter.route('/:qid')
    .get(isLoggedIn, function(req, res, next) {
        chat.getQuestionChatByQid(req.params.qid)
            .then((result) => {
                res.status(200).json({result});
            })
            .catch((err) => {
                res.status(404).json(err);
            })      
    })

    .post(isLoggedIn, function(req, res, next) {
        chat.newMessage({qid: req.params.qid, uid: req.user.id, message:req.body.message, username: req.user.username})
        .then((result) => {
            chat.getQuestionChatByQid(req.params.qid)
            .then((result) => {
                const questionchatRedisChannel = 'socket.io#/questionchat#';
                redisClient.publish(`${questionchatRedisChannel}${req.params.qid}`, JSON.stringify(result));
                res.status(200).json(result);
            })
            .catch((err) => {
                res.status(404).json(err);
            });
        })
        .catch((err) => {
            res.status(404).json(err);
        })
    })

    .delete(isLoggedIn, function(req, res, next) {
        chat.removeQuestionChat(req.params.qid)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(404).json(err);
        })
    })

module.exports = apirouter
