'use strict';

import SceneLights from "./sceneLights.js"
import GlobalSettings from "./globalSettings.js"

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab:'Global'
        };
    }

    createTab(tabInfo){
        return React.createElement(
            'li',
            {
                key:`tabInfo-${tabInfo.name}`,
                className: tabInfo.name === this.state.activeTab ? 'is-active' : ''
            },
            React.createElement(
                'a',
                {
                    key:'',
                    onClick: () => {
                        this.setState({
                            activeTab: tabInfo.name
                        })
                    }
                },
                [
                    React.createElement(
                        'span',
                        {
                            key:`tabInfo-icon-${tabInfo.name}`,
                            className: 'icon is-small'
                        },
                        React.createElement(
                            'i',
                            {
                                key:`tabInfo-iconclass-${tabInfo.name}`,
                                className: tabInfo.fontClass
                            },
                            null
                        )
                    ),
                    React.createElement(
                        'span',
                        {
                            key:`tabInfo-Name-${tabInfo.name}`
                        },
                        tabInfo.name
                    )
                ]
            )
        );
    }

    render() {
        const tabElements = [
            {
                name:'Global',
                fontClass:'fas fa-image'
            },
            {
                name:'Lights',
                fontClass:'fas fa-lightbulb'
            },
            {
                name:'Materials',
                fontClass:'fas fa-paint-brush'
            },
            {
                name:'Camera',
                fontClass:'fas fa-camera'
            }
        ].map(this.createTab.bind(this));

        let settingsContainer;

        switch(this.state.activeTab){
            case 'Global':
                settingsContainer = React.createElement(
                    GlobalSettings, 
                    {key:'GlobalSettings'},
                    null
                );
                break;
            case 'Lights':
                settingsContainer = React.createElement(
                    SceneLights, 
                    {key:'SceneLights'},
                    null
                );
                break;
            case 'Materials':
                settingsContainer = null;
                break;
            case 'Camera':
                settingsContainer = null;
                break;
            default:
                break;
        }

        return React.createElement(
            'div',
            {
                key:'',
            },
            React.createElement(
                'div',
                {
                    id:'SettingsTabs',
                    className: 'tabs is-toggle is-toggle-rounded',
                    key: ''
                },
                React.createElement(
                    'ul',
                    {
                        key:'',
                    },
                    tabElements,
                )
            ),
            settingsContainer
        );
    }
}

export default Settings;
