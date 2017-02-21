const express = require('express');
const queries = require('../db/queries');
const passport = require('passport');
const bcrypt = require('bcrypt');

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
        if (req.user.admin == 1) {
            if (req.query.page == undefined) {
                queries.listUsers(0)
                    .then((results) => {
                        return res.status(200).send(results);
                    })
                    .catch((err) => {
                        return res.status(401).json({error: err});  
                    })
            }
            else {
                queries.listUsers(req.query.page)
                    .then((results) => {
                        return res.status(200).send(results);
                    })
                    .catch((err) => {
                        return res.status(402).json( {error: err} );
                    })
            }
        }
        else {
            res.status(403).json("not authenticated");
        }
    })

    .post(function(req, res) {
        queries.insertNewUser({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: req.body.password, admin: 0})
            .then((result) => {
                    queries.getUserById(result.insertId)
                        .then((userInfo) => {
                            res.status(200).json(userInfo);
                        })
                        .catch((err) => {
                            res.status(404).json({error: err, message: "Register success but lookup not success"});
                        })
            })
            .catch((err) => {
                res.status(409).json({error: err, message: "Another user already has that username. Choose another!"});
            })
    });

apirouter.route('/:id')
    .put(isLoggedIn, function(req, res, next) {
        if (req.user.admin == 1 || (req.user.id == req.params.id)) {
            queries.updateUserInfo(req.params.id, req.body)
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
    })
    
    .get(isLoggedIn, function(req, res, next) {
        if (req.user != undefined) {
            if (req.user.admin == 1 || (req.user.id == req.params.id)) {
                queries.getUserById(req.params.id)
                    .then((result) => {
                        return res.status(200).json(result);
                    })
                    .catch((err) => {
                        return res.status(404).send({error: err});
                    });
                   
            }
            else {
                res.status(403).json({message: "not authenticated"});
            }
        }
    });

module.exports = apirouter
