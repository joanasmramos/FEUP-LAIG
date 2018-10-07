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
		
		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;


		this.initBuffers();
	};


	initBuffers()
	{
		//VERTICES & NORMALS
		this.vertices = [];
		this.normals = [];
		this.texCoords = [];

		this.deltaHeight = this.height / this.stacks;
		this.delta = (this.top - this.base) / this.stacks;
	

		var ang = 2 * Math.PI / this.slices;
		for(var i = 0; i <= this.stacks; i++){
			
			var inc = (i * this.delta) + this.base;

			for(var j = 0; j < this.slices; j++){
				this.vertices.push(inc*Math.cos(j*ang), inc*Math.sin(j*ang), i*this.deltaHeight);

				this.normals.push(Math.cos(ang*j), Math.sin(ang*j), 0);

				this.texCoords.push(j * 1/this.slices, i * 1/this.stacks);
			}
		}

		//INDICES
		this.indices = [];

		var nVert = this.stacks * this.slices;

		for(var i = 0; i < nVert; i++){
			if((i+1) % this.slices == 0){
				this.indices.push(i, i+1-this.slices, i+1);
				this.indices.push(i, i+1, i+this.slices);
			}else{
				this.indices.push(i, i+1, i+1+this.slices);
				this.indices.push(i, i+1+this.slices, i+this.slices);
			}
		}

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};
