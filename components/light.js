'use strict';

class Light extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.xInput = React.createRef();
        this.yInput = React.createRef();
        this.zInput = React.createRef();
    }

    async moveLight(){

        const previousLocation = this.state.location || this.props.light.location;

        const newLocation = {
            x: this.xInput.current.value,
            y: this.yInput.current.value,
            z: this.zInput.current.value
        };

        const distanceX = newLocation.x - previousLocation.x;
        const distanceY = newLocation.y - previousLocation.y;
        const distanceZ = newLocation.z - previousLocation.z;

        console.log(distanceX, distanceY, distanceZ);

        await WSM.APITransformObjects(
            0,
            [this.props.light.objectId],
            await WSM.Geom.MakeRigidTransform(
                await WSM.Geom.Point3d(distanceX, distanceY, distanceZ),
                await WSM.Geom.Vector3d(1, 0, 0),
                await WSM.Geom.Vector3d(0, 1, 0),
                await WSM.Geom.Vector3d(0, 0, 1)
            )
        );
    
        this.setState({
            location:newLocation
        });
    }

    componentDidMount(){}

    render() {
        console.log(this.props);

        return React.createElement(
            'li',
            {
                className: '',
                key: `light-${this.props.light.objectId}`
            },
            [
                React.createElement(
                    'input',
                    {
                        type: 'number',
                        className: '',
                        key: `light-${this.props.light.objectId}-x`,
                        ref: this.xInput,
                        defaultValue: this.props.light.location.x
                    },
                    null
                ),
                React.createElement(
                    'input',
                    {
                        type: 'number',
                        className: '',
                        key: `light-${this.props.light.objectId}-y`,
                        ref: this.yInput,
                        defaultValue: this.props.light.location.y
                    },
                    null
                ),
                React.createElement(
                    'input',
                    {
                        type: 'number',
                        className: '',
                        key: `light-${this.props.light.objectId}-z`,
                        ref: this.zInput,
                        defaultValue: this.props.light.location.z
                    },
                    null
                ),
                React.createElement(
                    'button',
                    {
                        className: 'button is-warning block',
                        key: `light-${this.props.light.objectId}-move`,
                        onClick: this.moveLight.bind(this)
                    },
                    'Move'
                )
            ]

        );
    }
}

export default Light;
