import RenderUI from "./components/renderUI.js";


class RenderPlugin{
    constructor(){
        this.socket = undefined;
        this.socketIsConnected = false;

        FormItInterface.Initialize(() => {
            this.build();
            this.createSocketConnection();
        });
    }

    build(){
        const domContainer = document.getElementById('RenderContainer');
        const renderUIComponent = React.createElement(RenderUI, {
            isConnected: this.socketIsConnected
        }, null);

        ReactDOM.render(renderUIComponent, domContainer);
    }

    createSocketConnection(){
        this.socketIsConnected = false;

        //TODO expose UI for user to enter port? or try port discovery?
        const port = 9901;

        this.socket = new WebSocket(`ws://localhost:${port}`);

        this.socketConnectionCheckInterval = setInterval(() => {
            if(this.socketIsConnected){
                clearInterval(this.socketConnectionCheckInterval);

                //refresh UI
                this.build();
            }
        }, 1000);

        this.socket.onopen = (event) => {
            this.socketIsConnected = true;
            console.log('sending Plugin connected');
            this.socket.send('Plugin connected');
        };

        this.socket.onmessage = (event) => {
            console.log(event.data);
        }

        this.socket.onerror = (event) => {
            console.log('socket error', event);
        }

        this.socket.onclose = (event) => {
            console.log('socket was closed', event)
            this.socketIsConnected = false;

            //try to reconnect
            this.createSocketConnection();

            //refresh UI
            this.build();
        }
    }
}


new RenderPlugin();