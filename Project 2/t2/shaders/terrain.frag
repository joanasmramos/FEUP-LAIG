#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;
varying vec4 normal;
uniform vec4 selColor;
varying vec2 tex_coords;

uniform sampler2D texture;

void main() {
    gl_FragColor = texture2D(texture, tex_coords);
}