'use strict';

class Light extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.xInput = React.createRef();
        this.yInput = React.createRef();
        this.zInput = React.createRef();
        this.intensityInput = React.createRef();
        this.lightType = React.createRef();
        this.lightColor = React.createRef();

        this.attributeKey = 'RenderPlugin::Light';
    }

    async updateLight(){

        const mainHistID =0;
        const previousLocation = this.state.location || this.props.light.location;

        const newLocation = {
            x: this.xInput.current.value,
            y: this.yInput.current.value,
            z: this.zInput.current.value
        };

        const distanceX = newLocation.x - previousLocation.x;
        const distanceY = newLocation.y - previousLocation.y;
        const distanceZ = newLocation.z - previousLocation.z;

        console.log(distanceX, distanceY, distanceZ, this.props.light.objectId);

        await WSM.APITransformObject(
            mainHistID,
            this.props.light.objectId,
            await WSM.Geom.MakeRigidTransform(
                await WSM.Geom.Point3d(distanceX, distanceY, distanceZ),
                await WSM.Geom.Vector3d(1, 0, 0),
                await WSM.Geom.Vector3d(0, 1, 0),
                await WSM.Geom.Vector3d(0, 0, 1)
            )
        );
    
        const intensity = this.intensityInput.current.value;
        const color = this.lightColor.current.value;
        const type = this.lightType.current.value;

        console.log(intensity, color, type);

        console.log(this.props.light.objectId, this.attributeKey)

        await WSM.Utils.SetOrCreateStringAttributeForObject(
            mainHistID,
            this.props.light.objectId,
            this.attributeKey,
            JSON.stringify({
                intensity,
                radius: 10,
                color,
                type
            })
        );

        const res = await WSM.Utils.GetStringAttributeForObject(mainHistID, this.props.light.objectId, this.attributeKey);
        console.log(res);

        this.setState({
            location:newLocation
        });
    }

    componentDidMount(){}

    createField(fieldName, value){

        return React.createElement(
            'div',
            {
                className: 'control',
                key: `${fieldName}div`
            },
            [
                React.createElement(
                    'span',
                    {
                        key: `${fieldName}span`,
                        className: '',
                    },
                    fieldName
                ),
                React.createElement(
                    'input',
                    {
                        key: `${fieldName}input`,
                        className: 'input is-small',
                        type:'number',
                        defaultValue: value,
                        ref: this[`${fieldName}Input`]
                    },
                    null
                )
            ]
        );
    }

    render(){
        return React.createElement(
            'div',
            {
                className: 'field is-grouped is-grouped-multiline',
            },
            [
                this.createField('x', this.props.light.location.x),
                this.createField('y', this.props.light.location.y),
                this.createField('z', this.props.light.location.z),
                this.createField('intensity', this.props.light.data.intensity || 80),
                //TODO need to show light type current value....
                React.createElement(
                    'select',
                    {
                        className: '',
                        key: `light-${this.props.light.objectId}-select`,
                        ref: this.lightType
                    },
                    [
                        React.createElement(
                            'option',
                            {
                                className: '',
                                key: `light-${this.props.light.objectId}-optionPoint`,
                            },
                            'point'
                        ),
                        React.createElement(
                            'option',
                            {
                                className: '',
                                key: `light-${this.props.light.objectId}-optionSpot`,
                            },
                            'spot'
                        )
                    ]
                ),
                React.createElement(
                    'input',
                    {
                        className: 'colorInput',
                        key: `light-${this.props.light.objectId}-colorInput`,
                        type: "color",
                        defaultValue: this.props.light.data.color || "#ffffff",
                        ref: this.lightColor
                    },
                    null
                ),
                React.createElement(
                    'button',
                    {
                        className: 'button is-success block submitLightButton',
                        key: `light-${this.props.light.objectId}-move`,
                        onClick: this.updateLight.bind(this)
                    },
                    React.createElement('i', {key:'addPointLightIcon', className:'fas fa-check'}, '')
                )
            ]
        );
    }
    

    
    
    /*render() {
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
    }*/
}

export default Light;
