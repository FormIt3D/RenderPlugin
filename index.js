import Main from "./components/main.js";

class RenderPlugin{
    constructor(){        
        FormItInterface.Initialize(() => {
            this.build();
        });
    }

    build(){
        const domContainer = document.getElementById('RenderContainer');
        const mainComponent = React.createElement(
            Main, 
            {},
            null
        );

        ReactDOM.render(mainComponent, domContainer);
    }
}

new RenderPlugin();