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

}