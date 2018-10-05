var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.data = "";
        this.lightValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();
        this.lightValues = [];

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;

        for(var key in this.data.omniLights) {
            if(i>=8)
                break;
            
            this.lights[i].setPosition(this.data.omniLights[key].location["x"], this.data.omniLights[key].location["y"], this.data.omniLights[key].location["z"], this.data.omniLights[key].location["w"]);
            this.lights[i].setAmbient(this.data.omniLights[key].ambient["r"], this.data.omniLights[key].ambient["g"], this.data.omniLights[key].ambient["b"], this.data.omniLights[key].ambient["a"]);
            this.lights[i].setDiffuse(this.data.omniLights[key].diffuse["r"], this.data.omniLights[key].diffuse["g"], this.data.omniLights[key].diffuse["b"], this.data.omniLights[key].diffuse["a"]);
            this.lights[i].setSpecular(this.data.omniLights[key].specular["r"], this.data.omniLights[key].specular["g"], this.data.omniLights[key].specular["b"], this.data.omniLights[key].specular["a"]);

            if(this.data.omniLights[key].enabled)
                this.lights[i].enable();
            else this.lights[i].disable();

            this.lightValues[key] = this.data.omniLights[key].enabled;

            this.lights[i].update();

            i++;
        }
    }


    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        //<scene>
        this.axis = new CGFaxis(this, this.data.axisLength);

        //<views>
        this.camera = this.data.views[this.data.defaultView];
        this.interface.setActiveCamera(this.camera);

        //<ambient>
        this.setGlobalAmbientLight(this.data.ambientLight["r"], this.data.ambientLight["g"], this.data.ambientLight["b"], this.data.ambientLight["a"]);
        this.gl.clearColor(this.data.backgroundColor["r"], this.data.backgroundColor["g"], this.data.backgroundColor["b"], this.data.backgroundColor["a"]);

        this.initLights();

        // Adds lights group.
        this.interface.addOmniLightsGroup(this.data.omniLights);

        this.sceneInited = true;
    }


    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}