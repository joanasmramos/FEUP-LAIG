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
        this.id_material = "";
        this.shininess_material = 1;
        this.emission_material = ["", "", "", ""];
        this.ambient_material = ["", "", "", ""];
        this.diffuse_material = ["", "", "", ""];
        this.specular_material = ["", "", "", ""];

        //transformations
        this.transformations = [];
    }
}