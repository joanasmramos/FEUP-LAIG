/**
 * A baseless cylinder using NURBS surfaces (patches)
 */
class MyCylinder2 extends CGFobject {

    /**
     * 
     * @param {Scene} scene 
     * @param {Base radius} base 
     * @param {Top radius} top 
     * @param {Height} height 
     * @param {Slices} slices 
     * @param {Stacks} stacks 
     */
    constructor(scene, base, top, height, slices, stacks)
	{
		super(scene);
        
        this.scene = scene;
		this.slices = slices;
		this.stacks = stacks
		this.base = base;
		this.top = top;
		this.height = height;
		this.baseCircle = new MyCircle(scene, slices, base);
        this.topCircle = new MyCircle(scene, slices, top);

		this.initBuffers();
    }
    
    initBuffers() {
        let controlPoints1 = new Array();

        //quadric surface
        let npointsU = 5, npointsV = 2;
        let npartsU = this.slices, npartsV = this.stacks;

        controlPoints1.push([-this.top, 0, this.height/2, 1]);
        controlPoints1.push([-this.base, 0, -this.height/2, 1]);
        controlPoints1.push([-this.top, this.top, this.height/2, 0.707]);
        controlPoints1.push([-this.base, this.base, -this.height/2, 0.707]);
        controlPoints1.push([0, this.top, this.height/2, 1]);
        controlPoints1.push([0, this.base, -this.height/2, 1]);
        controlPoints1.push([this.top, this.top, this.height/2, 0.707]);
        controlPoints1.push([this.base, this.base, -this.height/2, 0.707]);
        controlPoints1.push([this.top, 0, this.height/2, 1]);
        controlPoints1.push([this.base, 0, -this.height/2, 1]);

        this.topPatch = new MyPatch(this.scene, npartsU, npartsV, npointsU, npointsV, controlPoints1);
    }

    display() {
        this.topPatch.display();
        //this.bottomPatch.display();

        this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 0, 0, 1);
            this.topPatch.display();
        this.scene.popMatrix();
    }

}