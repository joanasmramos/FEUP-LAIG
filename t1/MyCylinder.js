/**
 * MyCylinder
 * @param scene CGFscene where the Cylinder will be displayed
 * @param base radius of the bottom base of the cylinder
 * @param top radius of the top base of the cylinder
 * @param slices ammount of slices the Cylinder will be divided along it's perimeter
 * @param stacks ammount of stacks the Cylinder will be divided along it's correspondent height
 * @constructor
 */

class MyCylinder extends CGFobject
{
	constructor(scene, base, top, height, slices, stacks)
	{
		super(scene);
		
		this.slices = slices;
		this.stacks = stacks
		this.base = base;
		this.top = top;
		this.height = height;

		this.initBuffers();
	};


	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var stacks = this.stacks;

		var n = -2 * Math.PI / this.slices;

		this.deltaHeight = this.height / this.stacks;
		this.delta = (this.top - this.base) / this.stacks;
	
		var patchLengthx = 1 / this.slices;
		var patchLengthy = 1 / this.stacks;
		var xCoord = 0;
		var yCoord = 0;
	
		for (let q = 0; q < this.stacks+1 ; q++) {
			var z = (q * this.deltaHeight / this.stacks);
			var inc = (q * this.delta) + this.base;
	
			for (let i = 0; i <= this.slices; i++) {
				this.vertices.push(inc * Math.cos(i * n), inc * Math.sin(i * n), q * this.deltaHeight);
				this.normals.push(Math.cos(i * n), Math.sin(i * n), 0);
	
				this.texCoords.push(xCoord, yCoord);
	
				xCoord += patchLengthx;
			}
	
			xCoord = 0;
			yCoord += patchLengthy;
		}
		
		var sides = this.slices +1;
	
		for (let q = 0; q < this.stacks; q++) {
			for (let i = 0; i < this.slices; i++) {
				this.indices.push(sides*q+i, sides*(q+1)+i, sides*q+i+1);
				this.indices.push(sides*q+i+1, sides*(q+1)+i, sides*(q+1)+i+1);
	
				this.indices.push(sides*q+i, sides*q+i+1, sides*(q+1)+i);
				this.indices.push(sides*q+i+1, sides*(q+1)+i+1, sides*(q+1)+i);
			}
		}

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

};
