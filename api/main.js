const nconf = require('nconf')

nconf.argv()
    .env()
    .file({ file: 'config/test.json' })

// start the user REST API server
const api = require('./api')

// instantiate HTTP server and pass router to it
const server = require('http').Server(api.app);

const socketIOManager = require('./realtime/')
socketIOManager.initializeSocketIO(server, api.sessionMiddleware);

require('./realtime/redis-broadcaster.js');

const port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
