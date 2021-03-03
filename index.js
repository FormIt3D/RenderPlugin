import Main from "./components/main.js";
import getAllRenderInfo from "./getAllRenderInfo.js";

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
            {getAllRenderInfo},
            null
        );

        ReactDOM.render(mainComponent, domContainer);
    }
}

new RenderPlugin();