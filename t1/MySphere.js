/**
 * Class Sphere
 * 
 * Creates and draws a primitive of sphere type given the parameters.
 * @author Pedro Martins / Caroliza Azevedo
 * @version 1.0
 */
function Sphere(scene, radius, slices, stacks) {
    CGFobject.call(this, scene);

    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
};

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

/**
 * Initiates all the values (vertices, normals, indices and texture coordinates for the sphere primitive).
 * Overwrites the default initBuffers function.
 */
Sphere.prototype.initBuffers = function() {
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.unslicedTextCoords = [];

    for (var i = 0, verticesLength = this.vertices.length; i <= this.slices; i++) {
        for (var j = 0; j <= this.stacks; j++, verticesLength++) {
            var x = Math.sin(j * Math.PI / this.stacks) * Math.cos(i * 2 * Math.PI / this.slices);
            var y = Math.sin(j * Math.PI / this.stacks) * Math.sin(i * 2 * Math.PI / this.slices);
            var z = Math.cos(j * Math.PI / this.stacks);

			// defines the vertices	
            this.vertices.push(
                x * this.radius,
                y * this.radius,
                z * this.radius);

			// defines the normals
            this.normals.push(
                x,
                y,
                z);

			// defines the indices
            if (i > 0 && j > 0) {
                this.indices.push(
                    verticesLength - this.stacks - 1,
                    verticesLength - 1,
                    verticesLength - this.stacks - 2,
                    verticesLength - 1,
                    verticesLength - 2,
                    verticesLength - this.stacks - 2);
            }

			// defines the texture coordinates
            this.unslicedTextCoords.push(
                0.5 + 0.5 * x,
                0.5 - 0.5 * y);

            this.texCoords = this.unslicedTextCoords.slice();
        }

    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

/**
 * Amplify the texture of the primitive given its values.
 * Not required. Exists only to avoid inheritance error.
 * @param lenghtS the S l
 */
Sphere.prototype.setSandT = function(lenghtS, lenghtT) {
    this.updateTexCoordsGLBuffers();
}