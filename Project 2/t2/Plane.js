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
				var plane_controlPoints = 
				[	
					// U = 0
					[ // V = 0..1;
						 [-0.5, 0, 0.5, 1 ],
						 [-0.5, 0, -0.5, 1 ]
						
					],
					// U = 1
					[ // V = 0..1
						 [ 0.5, 0, 0.5, 1 ],
						 [ 0.5, 0, -0.5, 1 ]							 
					]
				];

		    let NURBS_surface = new CGFnurbsSurface(1, 1, plane_controlPoints);

		    this.plane = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, NURBS_surface);

     };

/**
 * Displaying plane/surface
 */
	display() {
		this.scene.pushMatrix();
		this.plane.display();
		this.scene.popMatrix();
	}

}
