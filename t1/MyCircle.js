/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCircle extends CGFobject {
  constructor(scene, slices) {
    super(scene);

    this.slices = slices;

    this.initBuffers();
  };

  initBuffers(){
    this.vertices =[];
    this.indices=[];
    this.normals=[];
    this.texCoords = [];

    let ang=2*Math.PI/this.slices;

    this.vertices.push(0, 0, 0);

    this.normals.push(0, 0, 1);

    this.texCoords.push(0.5,0.5);

    for (let i=0; i< this.slices; i++) {
      this.vertices.push(Math.cos(i*ang),Math.sin(i*ang), 0)
      this.normals.push(0, 0, 1);
      this.texCoords.push(0.5 + Math.cos(ang * i) / 2, 0.5 - Math.sin(ang * i) / 2);
    }

    for(let i=1; i<=this.slices; i++) {
      if(i==this.slices) {
        this.indices.push(0, i, 1);

      }
      else {
        this.indices.push(0, i, i+1);
      }
    }

    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
};
