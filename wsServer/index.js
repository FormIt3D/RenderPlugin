const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 9901 });

server.on('connection', (socket) => {
    socket.on('message', (message) => {
        console.log('received: %s', message);
    });

    socket.send('something');
});