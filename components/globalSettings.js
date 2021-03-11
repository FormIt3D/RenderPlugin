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
                key: ''
            },
            [
                React.createElement(
                    'div',
                    {
                        className: 'field',
                        key: ''
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
                        key: ''
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
                key: ''
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
                    key: 'RenderQulaitySettings'
                },
                'Render Quality'
            ),
            this.buildQualitySettings(),
            React.createElement(
                'div',
                {
                    className:'settingsHeader',
                    key: 'RenderQulaitySettings'
                },
                'Resolution'
            ),
            this.buildResolutionSettings()
        ]
    }
}

export default GlobalSettings;
