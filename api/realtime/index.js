/**
 * Generic module to deal with realtime notifications via socket.io
 * This module supports maintaining a set of currently connected clients
 * and broadcasting messages to them.
 */
const socketio = require('socket.io')
 
const EventEmitter = require('events');

const redis = require('redis');
const redisClient = redis.createClient();

class SocketIOManager extends EventEmitter {
    constructor() {
        super();
        this.connectedClients = new Set();
    }
 
    // broadcast a message to all connected clients
    broadcast(msg, data) {
        // broadcast to all connected clients
        for (const conn of this.connectedClients) {
            conn.emit(msg, data);
        }
    }
 
    initializeSocketIO(server, sessionMiddleware) {
        const io = socketio(server, { path: '/api/socket.io' });

        io.use((client, next) => {
            sessionMiddleware(client.request, client.request.res, next);
        });

        io.of("/votes").on('connection', (client) => {
            client.on('subscribe', (msg) => {
                client.join(msg.qid);

            });
            client.on('unsubscribe', (msg) => {
                client.leave(msg.qid);
            });
        });

        const voteRedisChannel = 'socket.io#/votes#';
        redisClient.psubscribe(`${voteRedisChannel}*`);

        redisClient.on("pmessage", (pchannel, channel, message) => {
            if (channel.startsWith(voteRedisChannel)) {
                const qid = channel.substring(voteRedisChannel.length).replace("#", "");
                io.of("/votes").to(qid).emit('voteupdate', {
                    questionid: qid,
                    results: JSON.parse(message)
                });
                return;
            }
        });
        
        io.of("/questionchat").on('connection', (client) => {
            client.on('subscribe', (msg) => {
                client.join(msg.qid);

            });
            client.on('unsubscribe', (msg) => {
                client.leave(msg.qid);
            });
        });

        const questionchatRedisChannel = 'socket.io#/questionchat#';
        redisClient.psubscribe(`${questionchatRedisChannel}*`);

        redisClient.on("pmessage", (pchannel, channel, message) => {
            if (channel.startsWith(questionchatRedisChannel)) {
                const qid = channel.substring(questionchatRedisChannel.length).replace("#", "");
                io.of("/questionchat").to(qid).emit('questionchatupdate', {
                    questionid: qid,
                    results: JSON.parse(message)
                });
                return;
            }
        });


        io.on('connection', (client) => {
            console.dir(client.request.session);
            console.log("\n user session \n");

            this.connectedClients.add(client)
            //There is no need for a listener for this emite
            this.emit('newclient', client);

            this.on('newclient', () => {
                console.log('new client hi');
            });
 
            client.on('disconnect', () => {
                this.connectedClients.delete(client);
                this.emit('disconnect', client);
            });
 
            // built-in client:ping/server:pong for illustration
            client.on('client:ping', () => {
                client.emit('server:pong');
            });
        });

    }
}
 
module.exports = new SocketIOManager();
