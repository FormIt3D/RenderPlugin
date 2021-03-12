'use strict';

import Light from "./light.js"

class SceneLights extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lights: []
        };

        this.attributeKey = 'RenderPlugin::Light';
    }

    async moveLight(light){

        const previousLocation = light.location;

        const newLocation = 

        await WSM.APITransformObjects(mainHistID, [5], await WSM.Geom.MakeRigidTransform(await WSM.Geom.Point3d(-1, -14, 0), await WSM.Geom.Vector3d(1, 0, 0), await WSM.Geom.Vector3d(0, 1, 0), await WSM.Geom.Vector3d(0, 0, 1)));
    }

    async addPointLight() {
        await FormIt.UndoManagement.BeginState();
        //temporary hacking
        const mainHistID = 0;
        WSM.nInstanceType = 24

        const point3d = await WSM.Geom.Point3d(30, 30, 30);
        const pointId = await WSM.APICreateVertex(mainHistID, point3d);
        const groupId = await WSM.APICreateGroup(mainHistID, [pointId]);
        const instanceId = await WSM.APIGetObjectsByTypeReadOnly(mainHistID, groupId, WSM.nInstanceType);
        const result = await WSM.Utils.SetOrCreateStringAttributeForObject(
            mainHistID,
            instanceId[0],
            this.attributeKey,
            JSON.stringify({
                intensity: 80,
                radius: 10,
                color:"#ffffff",
                type:'point'
            })
        );
    
        FormIt.UndoManagement.EndState("Create light.");

        this.discoverAllLights();
    }

    async discoverAllLights(){
        //temporary hacking
        const mainHistID = 0;
        WSM.nInstanceType = 24;

        const objectsToCheck = await WSM.APIGetAllObjectsByTypeReadOnly(mainHistID, WSM.nInstanceType);

        const lightPromises = objectsToCheck.map(async (objectId) => {
            const res = await WSM.Utils.GetStringAttributeForObject(mainHistID, objectId, this.attributeKey);
            console.log(res);

            if (res.success){
                const boundingBox = await WSM.APIGetBoxReadOnly(0, objectId);
                const location = boundingBox.lower;

                //hack fix the existing lights.
                /*await WSM.Utils.SetOrCreateStringAttributeForObject(
                    mainHistID,
                    objectId,
                    this.attributeKey,
                    JSON.stringify({
                        intensity: 80,
                        radius: 10,
                        color : '#ffffff',
                        type: 'point'
                    })
                );*/

                return {
                    objectId,
                    location,
                    data:JSON.parse(res.value)
                }
            }
        });
        
        let lights = await Promise.all(lightPromises);
        
        lights = lights.filter( Boolean );

        this.setState({lights})
    }

    componentDidMount(){
        this.discoverAllLights();
    }

    render() {
console.log(this.state.lights)
        const lightElements = this.state.lights.map((light) => {
            return React.createElement(
                Light,
                {light},
                null
            );
        });

        return React.createElement(
            'div',
            {
                id: 'SceneLights',
                className: '',
                key: 'SceneLights'
            },
            [
                React.createElement(
                    'ul',
                    {
                        className: '',
                        key:'allLights',
                    },
                    lightElements
                ),
                React.createElement(
                    'button',
                    {
                        id:'CreateLight',
                        className: 'button is-warning block',
                        key:'addPointLight',
                        onClick: this.addPointLight.bind(this)
                    },
                    [
                        React.createElement('span', {key:'addPointLight'}, 'Add light'),
                        React.createElement('i', {key:'addPointLightIcon', className:'fas fa-lightbulb'}, '')
                    ]
                )
            ]
        );
    }
}

export default SceneLights;
