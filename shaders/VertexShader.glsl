attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec3 aVertexNormal;
attribute vec2 aVertexTextureCoord;

uniform mat4 uModelViewMat;
uniform mat4 uProjectionMat;
uniform mat3 uNormalMat;

varying vec3 vColor;
varying vec2 vTextureCoord;
varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;

void main () {
    // calculate the vertex position in eye coordinate
    vec4 vertexPositionEye4 = uModelViewMat * vec4(aVertexPosition, 1.0);
    vVertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;

    // calculate the normal vector in eye coordinates
    vNormalEye = normalize(uNormalMat * aVertexNormal);

    // transform and calculate texture coordinates
    vTextureCoord = aVertexTextureCoord;

    // set color of fragment shader
    vColor = aVertexColor;

    // calculate the projection position
    gl_Position = uProjectionMat * vertexPositionEye4;
}