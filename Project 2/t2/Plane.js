/**
* Plane
*/
 class Plane extends CGFobject{
	 /*
	 * @constructor
	 * @param {where the plane will be drawn on} scene
	 * @param npartsU
	 * @param npartsV
	 */
     constructor(scene, npartsU, npartsV) {
			 super(scene);

				this.npartsU = npartsU;
				this.npartsV = npartsV;
				var plane_controlPoints = [ [
					[-0.5,0,0.5,1],
					[-0.5,0,-0.5,1]
				],[
					[0.5,0,0.5,1],
					[0.5,0,-0.5,1]]];

			   this.degree_U = npartsU - 1;
			   this.degree_V = npartsV - 1;

		    var NURBS_surface = new CGFnurbsSurface(this.degree_U, this.degree_V, plane_controlPoints);

		    this.plane = new CGFnurbsObject(this.scene, NURBS_surface, this.npartsU, this.npartsV);

     };

/**
 * Displaying plane/surface
 */
	display() {
		//console.log("ayy");
  this.scene.pushMatrix();

		//console.log("ayy1");
  this.plane.display();

		//console.log("ayy2");
  this.scene.popMatrix();
	}

}
