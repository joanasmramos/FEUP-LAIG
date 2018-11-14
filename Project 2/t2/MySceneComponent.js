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
        this.defaultMaterial = 0;
        this.texture = null;
        this.lengthS = null;
        this.lengthT = null;
        this.componentref = new Array();
        this.primitiveref = new Array();
        this.animationref = new Array();
        this.animations = new Array();
    }

    switchMaterial() {
        if(this.defaultMaterial < this.materials.length - 1) {
            this.defaultMaterial++;
        }
        else {
            this.defaultMaterial = 0;
        }
    }
}
