'use strict';

class SceneLights extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async addPointLight() {
        await FormIt.UndoManagement.BeginState();
        //temporary hacking
        const nHistoryID = 0;
        const point3d = await WSM.Geom.Point3d(30, 30, 30);
    
        await WSM.APICreateVertex(nHistoryID, point3d);
    
        FormIt.UndoManagement.EndState("Create light.");
    }

    render() {
        return React.createElement(
            'div',
            {
                className: '',
                key: 'SceneLights'
            },
            React.createElement(
                'button',
                {
                    className: 'button is-warning block',
                    key:'addPointLight',
                    onClick: this.addPointLight.bind(this)
                },
                [
                    React.createElement('span', {key:'addPointLight'}, 'Add point light'),
                    React.createElement('i', {key:'addPointLightIcon', className:'fas fa-lightbulb'}, '')
                ]
            )
        );
    }
}

export default SceneLights;
