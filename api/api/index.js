/*
 * Implement router for /api endpoints.
 */
const express  = require('express');
const passport = require('passport');
const queries = require('../db/queries.js');
const users = require('./users');
const questions = require('./questions');
const chat = require('./chat');

var apirouter = express.Router();

apirouter.get('/', function(req, res) {
	res.json({ status : true, message: 'API is accessible' });	
});

apirouter.use('/users', require('./users'))
apirouter.use('/questions', require('./questions'))
apirouter.use('/chat', require('./chat'))
// Implement /api/login authentication entry point.
// For this to work, passport must be using a strategy
// from passport-local.
// You should implement that strategy in users.js
apirouter.post('/login',
    passport.authenticate('local'),
    (req, res) => {
        if (req.user) { 
            queries.getUserById(req.user.id)
                .then((user) => {
                    res.status(200).json(user);
                })
                .catch((err) => {
                    res.status(404).json(err);
                })
        } else {
            res.status(400).json("Not a user");
        }
    }
)

apirouter.get('/login',
    (req, res) => {
        if (!req.user) {
            res.set('Content-Type', 'text/javascript');
            res.send('var authState = { };');
        } else {
            res.set('Content-Type', 'text/javascript');
            queries.getUserById(req.user.id)
                .then((user) => {
                    res.send('var authState = {id:' + user.id + ',username: "' + user.username + '", firstname: "' + user.firstname + '", lastname: "' + user.lastname + '", email: "' + user.email + '", admin: ' + user.admin + '};');
                })
                .catch((err) => {
                    res.status(404).json(err);
                });
        }
    }
)

apirouter.get('/logout', 
    (req, res) => {
        req.logOut();
        req.session.destroy();
        res.json({message: "logged out"});
    }
)
 
module.exports = apirouter
