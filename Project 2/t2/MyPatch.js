/**
* MyPatch
*/
class MyPatch extends CGFobject{

    /**
     * Constructs a new patch
     * @param {scene} scene
     * @param {number of parts in dimension U} npartsU
     * @param {number of parts in dimension V} npartsV
     * @param {number of points in dimension U} npointsU
     * @param {number of points in dimension V} npointsV
     * @param {control points} controlPoints
     */
    constructor(scene, npartsU, npartsV, npointsU, npointsV, controlPoints) {
        super(scene);

        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.degreeU = npointsU - 1;
        this.degreeV = npointsV - 1;

        this.constructControlVertexes(npointsU, npointsV, controlPoints);
        
        //console.log(this.controlVertexes);

        let nurbsSurface = new CGFnurbsSurface(this.degreeU, this.degreeV, this.controlVertexes);
        this.patch = new CGFnurbsObject(this.scene, npartsU, npartsV, nurbsSurface);
        this.patch.initBuffers();
    }

    /**
     * Constructs control vertexes from control points
     * @param {number of points in dimension U} npointsU
     * @param {number of points in dimension V} npointsV
     * @param {control points} controlPoints
     */
    constructControlVertexes(npointsU, npointsV, controlPoints) {
        this.controlVertexes = new Array();

        for(let i=0; i<npointsU;i++){
            let controlPointU = new Array();

            for(let j=0; j<npointsV ;j++) {
                controlPointU.push(controlPoints[npointsV*i+j]);
            }

            this.controlVertexes.push(controlPointU);
        }
    }

    display() {
		this.scene.pushMatrix();
		    this.patch.display();
		this.scene.popMatrix();
	}
}
