/**
 * MySceneData class, destined to store some information relative to the scene
 */
class MySceneData {

    /** 
    * @constructor 
    */
    constructor() {
        //scene
        this.axisLength = ""; // float

        //views
        this.defaultView = ""; // string
        this.views = new Object(); // array associativo - this.views[viewId] = CGFcamera

        //ambient
        this.ambientLight = []; // array associativo - this.ambientLight["r"] = rValue (...)
        this.backgroundColor = []; // array associativo - this.backgroundColor["r"] = rValue (...)

        //lights
        this.omniLights = new Object();
        this.spotLights = new Object();
        this.numLights = 0;

        //textures
        this.textures = [];

        //materials
        this.materials = new Object();

        //transformations
        this.transformations = [];

        //primitives
        this.primitives = new Object();
    }
}