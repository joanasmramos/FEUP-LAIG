/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyQuad extends CGFobject {
	constructor(scene, x1, y1, x2, y2) {
		super(scene);
		//para as texturas dps
		// this.minS = minS;
		// this.maxS = maxS;
		// this.minT = minT;
		// this.maxT = maxT;
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.initBuffers();
	};

	initBuffers() {
		this.base = Math.abs(this.x2-this.x1);
		this.height = Math.abs(this.y2-this.y1);

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

		//para as texturas dps
		// this.texCoords = [
		// 	this.minS, this.maxT,
		// 	this.maxS, this.maxT,
		// 	this.minS, this.minT,
		// 	this.maxS, this.minT
		// ];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};