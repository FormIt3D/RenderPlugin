
const WebSocket = require('ws');
const url = 'ws://127.0.0.1:9903'
const connection = new WebSocket(url)


const sendwrapper = (message, payload) => {
    //Copy the values from the payload object, if one was supplied
    var payloadCopy = {};
    if (payload !== undefined && payload !== null) {
        var keys = Object.keys(payload);
        for (index in keys) {
            var key = keys[index];
            payloadCopy[key] = payload[key];
        }
    }

    payloadCopy['__MESSAGE__'] = message;
    connection.send(JSON.stringify(payloadCopy));
}


exports.sendwrapper = sendwrapper;
exports.connection = connection;