/**
 * MySceneData class, destined to store some information relative to the scene
 */
class MySceneData {

    /** 
    * @constructor 
    */
    constructor() {
        //scene
        this.axisLength = "";

        //views
        this.defaultView = "";
        this.views = new Object();

        //ambient
        this.ambientLight = [];
        this.backgroundColor = [];

        //lights
        this.lights = [];
        this.id_lights ="";
        this.enabled ="";
        this.angle ="";
        this.numLights = "";

        //textures
        this.id_texture = "";
        this.file_texture = "";

        //materials
        this.id_material = "";
        this.shininess_material = 1;
        this.emission_material = ["", "", "", ""];
        this.ambient_material = ["", "", "", ""];
        this.diffuse_material = ["", "", "", ""];
        this.specular_material = ["", "", "", ""];
    }
}