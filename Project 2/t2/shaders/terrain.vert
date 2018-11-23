#ifdef GL_ES
precision highp float;
#endif
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 tex_coords;

uniform sampler2D heightmap;
uniform float heightscale;

void main() {
    tex_coords = aTextureCoord;
    
    vec3 newPos = vec3(aVertexPosition.x, aVertexPosition.y + texture2D(heightmap, aTextureCoord)[0] * heightscale, aVertexPosition.z);

    gl_Position = uPMatrix * uMVMatrix * vec4(newPos, 1.0);
}