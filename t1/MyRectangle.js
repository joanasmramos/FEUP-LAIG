/**
 * MyRectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 
class MyRectangle extends CGFobject {

	/* Assuming:
		x1,y1
		  *_________________*
		  |					|
		  |					|
		  *_________________* 
		  				  x2,y2
	*/

	constructor(scene, x1, y1, x2, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.lengthX = Math.abs(x2-x1);
		this.lengthY = Math.abs(y2-y1);

		this.initBuffers();
	};

	initBuffers() {

		this.vertices = [
			this.x1,this.y1,0,
			this.x2,this.y1,0,
			this.x1,this.y2,0,
			this.x2,this.y2,0
		];

		this.indices = [
			0, 2, 1,
			3, 1, 2
		];


		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.textureSet = false;

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	setTexCoords(lengthS, lengthT){
		this.texCoords = [
			0, 0,
			this.lengthX/lengthS, 0,
			0, this.lengthY/lengthT,
			this.lengthX/lengthS, this.lengthY/lengthT
		];

		this.textureSet = true;

		this.updateTexCoordsGLBuffers();
	}
};