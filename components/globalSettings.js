'use strict';

class GlobalSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    buildResolutionSettings() {
        return React.createElement(
            'div',
            {
                className: '',
                key:'ResSettingsKey'
            },
            [
                React.createElement(
                    'div',
                    {
                        className: 'field',
                        key: 'WidthField'
                    },
                    [
                        React.createElement(
                            'label',
                            {
                                className: 'label',
                                key: 'WidthLabel'
                            },
                            'Width'
                        ),
                        React.createElement(
                            'div',
                            {
                                className: 'control',
                                key: 'WidthDiv'
                            },
                            React.createElement(
                                'input',
                                {
                                    className: 'input',
                                    type:'text',
                                    placeholder:''
                                },
                                null
                            )
                        )
                    ]
                ),
                React.createElement(
                    'div',
                    {
                        className: 'field',
                        key: 'HeightField'
                    },
                    [
                        React.createElement(
                            'label',
                            {
                                className: 'label',
                                key: 'HeightLabel'
                            },
                            'Height'
                        ),
                        React.createElement(
                            'div',
                            {
                                className: 'control',
                                key: 'HeightDiv'
                            },
                            React.createElement(
                                'input',
                                {
                                    className: 'input',
                                    type:'text',
                                    placeholder:''
                                },
                                null
                            )
                        )
                    ]
                )
            ]
        ); 
    }

    buildQualitySettings(){
        return React.createElement(
            'div',
            {
                className: 'control',
                key:'QualSettingsKey'
            },
            [
                React.createElement(
                    'label',
                    {
                        className: 'radio',
                        key: 'HighSetting'
                    },
                    [
                        React.createElement(
                            'input',
                            {
                                type: 'radio',
                                name:'High',
                                key: 'HighSettingRadio'
                            },
                            null
                        ),
                        ' High'
                    ]
                ),
                React.createElement(
                    'label',
                    {
                        className: 'radio',
                        key: 'MediumSetting'
                    },
                    [
                        React.createElement(
                            'input',
                            {
                                type: 'radio',
                                name:'Medium',
                                key: 'MediumSettingRadio'
                            },
                            null
                        ),
                        ' Medium'
                    ]
                ),
                React.createElement(
                    'label',
                    {
                        className: 'radio',
                        key: 'LowSetting'
                    },
                    [
                        React.createElement(
                            'input',
                            {
                                type: 'radio',
                                name:'Low',
                                key: 'LowSettingRadio'
                            },
                            null
                        ),
                        ' Low'
                    ]
                )
            ]
        );
    }

    render() {
        return [
            React.createElement(
                'div',
                {
                    className:'settingsHeader',
                    key: 'RenderQualitySettings'
                },
                'Render Quality'
            ),
            this.buildQualitySettings(),
            React.createElement(
                'div',
                {
                    className:'settingsHeader',
                    key: 'ResolutionSettings'
                },
                'Resolution'
            ),
            this.buildResolutionSettings()
        ]
    }
}

export default GlobalSettings;
