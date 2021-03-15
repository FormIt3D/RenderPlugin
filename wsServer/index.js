
const WebSocket = require('ws');
const fs = require('fs').promises;
const user  = require("./cppClient")
const util = require('util');
var exec = util.promisify(require('child_process').exec);
const server = new WebSocket.Server({ port: 9901 });
let socketserver;
const renderArnold = async (obj) => {
    const {socket, data} = obj;
    //Hook into Arnold here.
    console.log("writitng---")
    await fs.writeFile("C:\\Users\\lagadas\\Documents\\Recharge\\Arnold-6.2.0.1-windows\\input\\hellowworld.json",JSON.stringify(data))
    console.log("written--")
    let objc = {"connection":"open"}
    user.connection.onmessage.bind(this)
    user.sendwrapper("message", objc)

}

user.connection.onmessage = (e) => {
    console.log(e.data)
    renderedImage(socketserver)
  }
const renderedImage = async (socketserver) =>{
    const base64ImageData = await fs.readFile("C:\\Users\\lagadas\\Documents\\Recharge\\render-plugin-recharge\\Pierre\\ArnoldTest\\NewServer\\scene1.jpg", 'base64');
    socketserver.send(JSON.stringify({
        type:'renderFinished',
        data: base64ImageData
    }));
}

server.on('connection', (socket) => {
    socketserver = socket;
    socket.on('message', (message) => {
        console.log("this the connew")
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
            }
        }
        catch(e){
            //TODO handle initial ws message which can't be parsed.....
            console.log(e);
        }
    });

    //socket.send('Server received connection');
});
