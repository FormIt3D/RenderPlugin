const WebSocket = require('ws');
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const server = new WebSocket.Server({ port: 9901 });

const renderArnold = async (obj) => {
    const {socket, data} = obj;

    //Hook into Arnold here.

    //Temporary, send an image back.
    const tempImageLocation = 'arnoldTemp.jpg'

    const base64ImageData = await readFile(tempImageLocation, 'base64');

    socket.send(JSON.stringify({
        type:'renderFinished',
        data: base64ImageData
    }));
}

server.on('connection', (socket) => {
    socket.on('message', (message) => {
        try{
            message = JSON.parse(message);
            console.log('received: %s', message);

            switch(message.type){
                case 'renderArnold': 
                    renderArnold({
                        socket,
                        data: message.data
                    });
                    break;
            }
        }
        catch(e){
            //TODO handle initial ws message which can't be parsed.....
            console.log(e);
        }
    });

    socket.send('Server received connection');
});