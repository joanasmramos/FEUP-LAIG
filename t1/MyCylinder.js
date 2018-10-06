/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder extends CGFobject
{
	constructor(scene, slices, stacks)
	{
		super(scene);

		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	};


	initBuffers(){
		this.vertices =[];
		this.indices=[];
		this.normals=[];

		let ang=2*Math.PI/this.slices;


		for(let j =0; j <= this.stacks; j++){
			for(let i=0; i < this.slices; i++){

				this.vertices.push(Math.cos(i*ang),Math.sin(i*ang),j/this.stacks);
				this.normals.push(Math.cos(i*ang),Math.sin(i*ang),0);

			}
		}	

		let nPontos = this.stacks*this.slices;

		for (let i = 0; i < nPontos; i++ ){
				if((i+1)%this.slices==0){
			this.indices.push(i,i+1-this.slices, i+1);
			this.indices.push(i,i+1, i+this.slices);
		}
			else{
			this.indices.push(i, i+1, i+1+this.slices);
			this.indices.push(i, i+1+this.slices, i+this.slices);
				}
		}

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};
