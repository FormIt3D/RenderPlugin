
const WebSocket = require('ws');
const fs = require('fs');
const user  = require("./cppClient")
const util = require('util');
var exec = util.promisify(require('child_process').exec);
const readFile = util.promisify(fs.readFile);

const server = new WebSocket.Server({ port: 9901 });

const renderArnold = async (obj) => {
    const {socket, data} = obj;
    
    //Hook into Arnold here.
    user.sendwrapper("message", data)
    /*const { stdout, stderr } = await exec('C:\\Users\\lagadas\\Documents\\Recharge\\Arnold-6.2.0.1-windows\\bin\\ArnoldTest.exe C:\\Users\\lagadas\\Documents\\Recharge\\Arnold-6.2.0.1-windows\\input');
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);

    const base64ImageData = await readFile("C:\\Users\\lagadas\\Documents\\Recharge\\Arnold-6.2.0.1-windows\\input\\scene1.jpg", 'base64');


    socket.send(JSON.stringify({
        type:'renderFinished',
        data: base64ImageData
    }));*/

}

user.connection.on('hello', function incoming(data) {
    console.log(data);
  });

const renderedImage = async (obj) =>{
    const base64ImageData = await readFile("C:\\Users\\lagadas\\Documents\\Recharge\\Arnold-6.2.0.1-windows\\input\\scene1.jpg", 'base64');
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

                    //temporary save json to file.
                    fs.writeFile('sample.json', JSON.stringify(message.data), (err) => {
                        if (err) throw err;
                        console.log('Saved!');
                    });

                    break;
                case 'hello':
                    renderedImage()
                    break;
            }
        }
        catch(e){
            //TODO handle initial ws message which can't be parsed.....
            console.log(e);
        }
    });

    //socket.send('Server received connection');
});