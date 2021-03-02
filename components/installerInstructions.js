'use strict';

class InstallerInstructions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return React.createElement(
            'div',
            {
                className: ''
            },
            'Have you installed the rendering plugin? Instructions to go here.'
        );
    }
}

export default InstallerInstructions;
