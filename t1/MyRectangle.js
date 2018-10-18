/**
 * MyQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyRectangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.sideS = x2-x1;
		this.sideT = y2-y1;

		this.initBuffers();
	};

	initBuffers() {
		var x3, y3, x4, y4;

		if(this.x1<this.x2) {
			x3=this.x2;
			y3=this.x1;
		}
		else {
			x3=this.x1;
			y3=this.y2;
		}

		if(this.y1<this.y2) {
			y4=this.y2;
			x4=this.y1;
		}
		else {
			y4=this.y1;
			x4=this.x2;
		}

		this.vertices = [
			this.x1, this.y1, 0,
			this.x2, this.y2, 0,
			x3, y3, 0,
			x4, y4, 0
		];

		// isto funciona para o NOSSO, mas acho que não é suposto ser assim
		this.indices = [
			0, 2, 1,
			0, 1, 3
		];


		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.texCoords = [
			0, 0,
			1, 1,
			1, 0,
			0, 1
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	setTexCoords(lengthS, lengthT){
		this.texCoords = [
			0, 0,
			this.sideS/lengthS, this.sideT/lengthT,
			this.sideS/lengthS, 0,
			0, this.sideT/lengthT
		];

		this.updateTexCoordsGLBuffers();
	}
};