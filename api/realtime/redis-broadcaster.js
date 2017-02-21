const redis = require('redis');
const redisClient = redis.createClient();
const socketIOManager = require('../realtime/');
const socket = require('socket.io');
const io = socket({path: '/api/socket.io'});

redisClient.subscribe('userapi:user:authchannel');
 
redisClient.on("message", (channel, message) => {
    const msg = message.split(/\s+/);
    const type = msg[0];
    socketIOManager.broadcast('auth', { type, data: msg.slice(1) });
});

// exports a 'shutdown' method (if needed)
module.exports = {
    shutdown: () => {
        redisClient.quit();
    }
}
