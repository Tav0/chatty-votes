// realtime/notifications.js
const { socket } = require('./socket');

socket.on('thisSendMessage', function(data) {
    console.dir(data);
    console.log('omg finally');
});
