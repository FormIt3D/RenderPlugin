'use strict';

import InstallerInstructions from "./installerInstructions.js";

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.socket = null;

        this.state = {
            socketIsConnected: false,
            imageData: ''
        };
    }

    componentDidMount(){
        this.createSocketConnection();
    }

    createSocketConnection(){
        this.setState({socketIsConnected : false});

        //TODO expose UI for user to enter port? or try port discovery?
        const port = 9901;

        this.socket = new WebSocket(`ws://localhost:${port}`);

        this.socketConnectionCheckInterval = setInterval(() => {
            if(this.state.socketIsConnected){
                clearInterval(this.socketConnectionCheckInterval);
            }
        }, 1000);

        this.socket.onopen = (event) => {
            this.setState({socketIsConnected : true});
            console.log('sending Plugin connected');
            this.socket.send('Plugin connected');
        };

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            switch(message.type){
                case 'renderFinished':
                    this.setState({'imageData': message.data});
                    break;
            }
        }

        this.socket.onerror = (event) => {
            console.log('socket error', event);
        }

        this.socket.onclose = (event) => {
            console.log('socket was closed', event)
            this.setState({socketIsConnected : false});

            //try to reconnect
            this.createSocketConnection();
        }
    }

    async startRender(type){
        const renderInfo = await this.props.getAllRenderInfo();
        console.log(renderInfo);

        this.socket.send(JSON.stringify({
            type,
            data: renderInfo
        }));
    }

    render() {

        if(this.state.socketIsConnected){
            return React.createElement(
                'div',
                {
                    className: '',
                },
                [
                    React.createElement(
                        'a',
                        {
                            className: '',
                            key:'renderStart',
                            onClick: () => {this.startRender('renderArnold')}
                        },
                        'Start Arnold render!'
                    ),
                    React.createElement(
                        'img',
                        {
                            className: '',
                            key: 'image',
                            src: `data:image/png;base64,${this.state.imageData}`
                        },
                    )
                ]
            );
            
        }else{
            return React.createElement(
                'div',
                {
                    className: ''
                },
                React.createElement(
                    InstallerInstructions, 
                    {},
                    null
                )
            );
        }
    }
}

export default Main;