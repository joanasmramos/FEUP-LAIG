#ifdef GL_ES
precision highp float;
#endif


attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 tex_coords;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform sampler2D heightmap;
uniform float heightscale;

uniform float timeFactor;
uniform float drag_factor;
uniform float texscale;

void main()
{
    vec2 drag = vec2(timeFactor, timeFactor);
    tex_coords = aTextureCoord;

    vec3 newPos = vec3(aVertexPosition.x, aVertexPosition.y + texture2D(heightmap, aTextureCoord*texscale + drag)[0] * heightscale, aVertexPosition.z);

    gl_Position = uPMatrix * uMVMatrix * vec4(newPos,1.0);
}
