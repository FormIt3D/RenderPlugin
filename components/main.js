'use strict';

import InstallerInstructions from "./installerInstructions.js";
import SceneLights from "./sceneLights.js"

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
            //console.log('sending Plugin connected');
            //this.socket.send('Plugin connected');
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

            const image = this.state.imageData
                ? React.createElement(
                    'img',
                    {
                        className: '',
                        key: 'image',
                        src: `data:image/png;base64,${this.state.imageData}`
                    },
                    null
                )
                : null;

            return [
                React.createElement(
                    'div',
                    {
                        id: 'RenderButtonContainer',
                        className: 'center',
                        key:'renderButtonContainer'
                    },
                    [
                        React.createElement(
                            'button',
                            {
                                className: 'button is-link block',
                                key:'renderButton',
                                onClick: () => {this.startRender('renderArnold')}
                            },
                            [
                                React.createElement(
                                    'img',
                                    {
                                        className: '',
                                        key: 'arnoldImage',
                                        src: `./images/arnold.jpg`
                                    },
                                    null
                                ),
                                React.createElement(
                                    'span',
                                    {
                                        className: '',
                                        key: 'renderButtonText',
                                    },
                                    'Start Arnold Render'
                                )
                            ]
                        )
                    ]
                ),
                image,
                React.createElement(
                    SceneLights, 
                    {key:'SceneLights'},
                    null
                )
            ];
        }else{
            return React.createElement(
                'div',
                {
                    className: ''
                },
                [
                    React.createElement(
                        InstallerInstructions,
                        {key:'InstallerInstructionsContainer',},
                        null
                    ),
                    React.createElement(
                        'a',
                        {
                            className: '',
                            key:'tryDebugRender',
                            onClick: () => {this.startRender('renderArnold')}
                        },
                        'Try anyways, to gether debug data.'
                    ),
                ]
            );
        }
    }
}

export default Main;