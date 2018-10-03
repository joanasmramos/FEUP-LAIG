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

        //lights
        this.lights = new Object();
        this.id_lights ="";º
        this.enabled ="";
        this.angle ="";

        //array para ambient c 4
        this.ambientComponent = ["", "", "", 1];
        this.backgroundComponent = ["", "", "", 1];

        //textures
        this.id_texture = "";
        this.file_texture = "";

        //materials
        this.id_material = "";
        this.shininess_material = 1;
        this.emission_material = ["", "", "", 1];
        this.ambient_material = ["", "", "", 1];
        this.diffuse_material = ["", "", "", 1];
        this.specular_material = ["", "", "", 1];
    }
}