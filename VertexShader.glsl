attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec3 aVertexNormal;
attribute vec2 aVertexTextureCoord;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uModelNormalMatrix;
uniform mat3 uViewNormalMatrix;
varying vec3 vVertexColor;
varying vec2 vTextureCoord;
varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;
varying mat4 vLightViewMatrix;

void main() {    
    vec4 vertexPositionEye4 = uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
    vLightViewMatrix = uViewMatrix;
    vVertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;
    vNormalEye = normalize(uViewNormalMatrix * uModelNormalMatrix * aVertexNormal);
    vVertexColor = aVertexColor;
    vTextureCoord = aVertexTextureCoord;
    gl_Position = uProjectionMatrix * vertexPositionEye4;
}