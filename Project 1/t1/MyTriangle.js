/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);
		this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
		this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.z1 = z1;
        this.z2 = z2;
        this.z3 = z3;

		this.initBuffers();
	}

	initBuffers() {

		this.vertices = [
			this.x1, this.y1, this.z1,
			this.x2, this.y2, this.z2,
			this.x3, this.y3, this.z3
		];

		this.indices = [
			0, 1, 2
		];


        var p1, p2, p3, a, b, norm;
        p1=vec3.fromValues(this.x1, this.y1, this.z1);
        p2=vec3.fromValues(this.x2, this.y2, this.z2);
		p3=vec3.fromValues(this.x3, this.y3, this.z3);

		a = [0,0,0], b = [0,0,0], norm = [0,0,0];

        vec3.subtract(a, p2, p1);
        vec3.subtract(b, p3, p1);
        vec3.cross(norm, a, b);

		this.normals = [
			norm[0], norm[1], norm[2],
			norm[0], norm[1], norm[2],
			norm[0], norm[1], norm[2]
		];

		this.textureSet = false;

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	setTexCoords(lengths, lengtht){
		var a, b, c, cosb, beta;

		a = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2) + Math.pow(this.z1 - this.z3, 2) );
		b = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2) + Math.pow(this.z2 - this.z1, 2) );
		c = Math.sqrt(Math.pow(this.x3 - this.x2, 2) + Math.pow(this.y3 - this.y2, 2) + Math.pow(this.z3 - this.z2, 2) );

		cosb = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2))/(2*a*c);
		beta = Math.acos(cosb);

		this.texCoords = [
			(c-a*cosb) / lengths, (1 - a*Math.sin(beta))/lengtht,
			0, 1/lengtht,
			c/lengths, 1/lengtht
		];

		this.textureSet = true;

		this.updateTexCoordsGLBuffers();
	}
};
