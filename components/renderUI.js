'use strict';

import InstallerInstructions from "./installerInstructions.js";

class RenderUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        if(this.props.isConnected){
            return React.createElement(
                'div',
                {
                    className: ''
                },
                'Is connected!'
            );
            
        }else{
            return React.createElement(
                'div',
                {
                    className: ''
                },
                [
                    'Plugin is unable to connect...',
                    React.createElement(
                        InstallerInstructions, 
                        {},
                        null
                    )
                ]
            );
        }
    }
}

export default RenderUI;