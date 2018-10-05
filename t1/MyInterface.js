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
     * Adds a folder for omni lights control
     * @param {array} lights
     */
    addOmniLightsGroup(lights) {

        var group = this.gui.addFolder("Omni lights");
        group.open();

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                //this.scene.omniValues[key] = lights[key].enabled;
                group.add(this.scene.omniValues, key);
            }
        }
    }

    /**
     * Adds a folder for spotlights control
     * @param {array} lights
     */
    addSpotLightsGroup(lights) {

        var group = this.gui.addFolder("Spotlights");
        group.open();

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                //this.scene.spotValues[key] = lights[key].enabled;
                group.add(this.scene.spotValues, key);
            }
        }
    }
}