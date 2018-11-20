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
        this.animated = null;
        this.animations = new Array();
        this.animationref = new Array();
        this.activeAnimation = 0;
    }

    switchMaterial() {
        if(this.defaultMaterial < this.materials.length - 1) {
            this.defaultMaterial++;
        }
        else {
            this.defaultMaterial = 0;
        }
    }

    switchAnimation() {
        if(this.animations[this.activeAnimation].done) {
            if(this.activeAnimation < this.animations.length-1) {
                this.activeAnimation++;
            }
        }
    }
}
