attribute vec3 aVertexPosition ;
attribute vec3 aVertexColor ;
attribute vec3 aVertexNormal ;
attribute vec2 aVertexTextureCoord ;
uniform mat4 uModelViewMatrix ;
uniform mat4 uProjectionMatrix ;
uniform mat3 uNormalMatrix ;
varying vec3 vColor ;
varying vec2 vTextureCoord ;
varying vec3 vNormalEye ;
varying vec3 vVertexPositionEye3 ;
void main () {
    // calculate the vertex position in eye coordinates
    vec4 vertexPositionEye4 = uModelViewMatrix * vec4 ( aVertexPosition , 1.0) ;
    vVertexPositionEye3 = vertexPositionEye4 . xyz / vertexPositionEye4 . w ;
    // calculate the normal vector in eye coordinates
    vNormalEye = normalize ( uNormalMatrix * aVertexNormal ) ;
    // set texture coordinates for fragment shader
    vTextureCoord = aVertexTextureCoord ;
    // set color for fragment shader
    vColor = aVertexColor ;
    // calculate the projected position
    gl_Position = uProjectionMatrix * vertexPositionEye4 ;
}