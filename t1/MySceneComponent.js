/**
 * My scene component
 */
class MySceneComponent{

    /** 
    * @constructor 
    */
    constructor() {
        this.transformationMat = null;
        this.materials = new Array();
        this.defaultMaterial = null;
        this.texture = null;
        this.lengthS = null;
        this.lengthT = null;
        this.componentref = new Array();
        this.primitiveref = new Array();
    }
}