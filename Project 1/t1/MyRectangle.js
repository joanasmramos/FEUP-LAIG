/**
 * MyRectangle
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

		this.sideX = Math.abs(x2-x1);
		this.sideY = Math.abs(y2-y1);

		this.initBuffers();
	};

	initBuffers() {

		this.vertices = [
			this.x1, this.y1, 0, // top left
			this.x2, this.y1, 0, // top right
			this.x1, this.y2, 0,  // bottom left
			this.x2, this.y2, 0 //bottom right
		];

		this.indices = [
			0, 1, 2,
			3, 2, 1
		];


		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

        
		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0,
        ];
        
        
        this.textureSet = false;

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	setTexCoords(lengthS, lengthT){
		this.texCoords = [
			0, this.sideY/lengthT,
			this.sideX/lengthS, this.sideY/lengthT,
			0, 0,
			this.sideX/lengthS, 0,
		];

        this.textureSet = true;

		this.updateTexCoordsGLBuffers();
	}
};