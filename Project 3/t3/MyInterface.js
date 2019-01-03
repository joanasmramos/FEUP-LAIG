/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui
        
        this.gui = new dat.GUI();
        // add a group of controls (and open/expand by defult)

        return true;
    }

    addOptionsGroup(){
        var group = this.gui.addFolder("General Options");
        group.open();
        
        group.add(this.scene, 'currentTheme', this.scene.themes).name("Environment");
    }
    /**
     * Adds a folder for lights control
     * @param {array} lights
     */
    addLightsGroup(omniLights, spotLights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        for (var key in omniLights) {
            if (omniLights.hasOwnProperty(key)) {
                group.add(this.scene.omniValues, key);
            }
        }

        for (var key in spotLights) {
            if (spotLights.hasOwnProperty(key)) {
                group.add(this.scene.spotValues, key);
            }
        }
    }

    /**
     * 
     */
    addViewsGroup() {
    var group = this.gui.addFolder("Views");
        group.open();

        const cameraIdArray = Object.keys(this.scene.data.views);
        this.currentCameraId = this.scene.data.defaultView;

        group.add(this, 'currentCameraId', cameraIdArray).name('Camera').onChange(val => this.scene.selectView(val)); 
    }

    /**
     * 
     * @param {event} event 
     */
    processKeyboard(event) {
        var m = 109, M=77;

        if(event.keyCode != m && event.keyCode != M)
            return;
        
        this.scene.switchComponentMaterials();

    }

    /**
     * Prompt user for board dimensions
     * @param {*} document 
     */
    getBoardDimensions(document) {
        let dimensions = prompt("Insert board dimensions.\nPossible options: 5, 6 or 7");
        while(dimensions != 5 && dimensions != 6 && dimensions != 7) {
            dimensions = prompt("Insert board dimensions.\nPossible options: 5, 6 or 7");
        }
        
        return dimensions;

        // let body = document.getElementsByTagName('body')[0];

        // let form = document.createElement('form');
        // form.setAttribute('method', 'post');
        // form.innerHTML = 
        //     '<label for="dimensions">Choose board dimensions (5/7):</label>' +
        //     '<input type="text" id="dimensions" name="dimensions" required="true">' +
        //     '<input type="submit" id="submit" value="Ready!" />';
        // console.log(form.outerHTML);

        // body.appendChild(form);

        /* CSS
        input, label {
        font: 'Verdana', sans-serif;
        text-align: center;
        width: auto;
        margin: .3em;
        justify-self: center;
        font-size: 1em;
        color: #6461a0;
        }

        input[type="text"] {
        border: ridge;
        border-color: #b497d6;
        border-width: .1em;
        border-radius: .5em;
        }

        input[type="submit"] {
        border-style: solid;
        border-width: .1em;
        border-color: gray;
        }

        label {
        font-size: 1.1em;
        font-weight: 600;
        }

        form {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-columns: 1fr;
        padding: 1em;
        font-size: 1em;
        border-style: ridge;
        border-color: #b497d6;
        border-radius: .8em;
        background-color: #e1e2ef;
        }
        */
    }
}