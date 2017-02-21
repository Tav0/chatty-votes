const Promise = require('bluebird') // override ES6 Promise to be able to use '.using'
const dbConn = require('./connection')

const bcrypt = require('bcrypt')

var salt = bcrypt.genSaltSync(10);

// look up user by id
// return (id, username, firstname, lastname, email, admin)
function getUserById(userid) {
    return new Promise((fulfill, reject) => {
        if (!userid) {
            reject("user error");
        }
        Promise.using(dbConn.get(), (conn) => {
            const query = `
                SELECT * FROM users
                WHERE id = ?
            `
            return conn.query(query, [userid]);
        })
        .then((result) => { 
            const user = result[0];
            if (!user) {
                reject("could not find user");
            }
            const apiResult = {id: user.id, username: user.username, firstname: user.firstname, lastname: user.lastname, email: user.email, admin: user.admin}
            fulfill(apiResult);
        })
        .catch((err) => {
            reject("User error");
        })
    })
}

// look up user by name
// return (*)
function getUserByName(username) {
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {
            const query = `
                SELECT * FROM users
                WHERE username = ?
            `
            return conn.query(query, [username]);
        })
        .then((result) => {
            const user = result[0];
            if (!user) {
                reject("Could not find user");
            }
            const apiResult = {id: user.id, username: user.username, password: user.password, firstname: user.firstname, lastname: user.lastname, email: user.email, admin: user.admin}
            fulfill(apiResult);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

// insert a new user and return its id
function insertNewUser({ username, firstname, lastname, email, password, admin }) {  
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {
            const query = `
                INSERT INTO users SET ?
            `
            return conn.query(query, {username: username, firstname: firstname, lastname: lastname, email: email, password: bcrypt.hashSync(password, salt), admin: 0});
        })
        .then((result) => {
            fulfill(result);
        })
        .catch((err) => {
            reject("Insert Error");
        })
    })
}

// appoint a user to be an admin
function appointAdmin(userid) {
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {
            const query = `
                UPDATE users SET ?
                WHERE id = ?
            `
            return conn.query(query, [{admin: 1}, userid]);
        })
        .then((result) => {
            fulfill(result);
        })
        .catch((err) => {
            reject("Admin error");
        })
    })
}

// update a user's information
// user is an object with some or all fields
function updateUserInfo(id, user) {
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {
            const query = `
                UPDATE users SET ?
                WHERE id = ?
            `
            if (user.password != undefined) {
                user.password = bcrypt.hashSync(user.password, salt);
                return conn.query(query, [user, id]);
            }
            else {
                return conn.query(query, [user, id]);
            }            
        })
        .then((result) => {
            if (!result) {
                reject("could not find user");
            }
            fulfill(result);
        })
        .catch((err) => {
            reject("Update Error");
        })
    })
}

// return list of up to pgSize users starting at page * pgSize
// for each user, list (id, username, lastname, firstname, email)
function listUsers(page, pgSize = 10) {
    return new Promise((fulfill, reject) => {
        Promise.using(dbConn.get(), (conn) => {
            return conn.query('SELECT * FROM users ')
        })
        .then((users1) => {
            if (!users1) {
                reject("Could not find users");
            }
            results = [];
            for (let i = 0; i < 10; i++) {
                if (users1[page * pgSize + i] != undefined) {
                    const user = users1[page * pgSize + i];
                    const apiResult = {id: user.id, username: user.username, password: user.password, firstname: user.firstname, lastname: user.lastname, email: user.email, admin: user.admin}
                    results.push(apiResult);
                }
            }
            let hasMore = false;
            if (page * pgSize + 10 <= users1.length) {
                hasMore = true;
            }
            fulfill({has_more: hasMore, users: results});
        })
        .catch((err) => {
            reject("Database Error");
        })
    })
}

module.exports = {
    getUserByName,
    getUserById,
    insertNewUser,
    listUsers,
    updateUserInfo,
    appointAdmin
}


