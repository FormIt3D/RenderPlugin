'use strict';

class SceneLights extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async addPointLight() {
        await FormIt.UndoManagement.BeginState();
        //temporary hacking
        var mainHistID = 0;

        var point3d = await WSM.Geom.Point3d(30, 30, 30);
    
        var pointId = await WSM.APICreateVertex(mainHistID, point3d);
        var groupId = await WSM.APICreateGroup(mainHistID, [pointId]);

        var instanceId = await WSM.APIGetObjectsByTypeReadOnly(mainHistID, groupId, WSM.nInstanceType);

        var result = await WSM.Utils.SetOrCreateStringAttributeForObject(mainHistID, instanceId, "schaefm::key", "schaefm::value");


        console.log(groupId, instanceId, result);


        var arrayToCheck = WSM.APIGetAllObjectsByTypeReadOnly(mainHistID, WSM.nInstanceType);

        for (var i = 0; i < arrayToCheck.length; i++)
        {
            var objectID = arrayToCheck[i];

            var objectHasStringAttributeResult = WSM.Utils.GetStringAttributeForObject(nHistoryID, objectID, stringAttributeKey);
            

            //TODO

        }
    
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
