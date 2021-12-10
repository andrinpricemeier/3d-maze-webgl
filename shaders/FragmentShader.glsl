precision mediump float;

uniform bool uEnableTexture;
uniform bool uEnableLightning;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;

varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;
varying vec3 vColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;

const float ambientFactor = 0.6;
const float diffuseFactor = 0.4;    //0.4
const float specularFactor = 0.8;   //0.8
const float shininess = 10.0;
// Wie viel wird reflektiert
// Anteil der spiegelnden Reflektion
const vec3 specularMaterialColor = vec3(0.5, 0.5, 0.5);
// über specularMaterialColor und shininess kann man einstellen, ob es eher wie Metall oder Plastik reflektiert.


void main() {
    vec3 baseColor = vColor;
    if(uEnableTexture) {
        baseColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;
    }

    if(uEnableLightning) {

        // ambient lighting
        vec3 ambientColor = baseColor.rgb * ambientFactor;

        // calculate light direction as seen from the vertex position
        vec3 lightDirectionEye = normalize(uLightPosition - vVertexPositionEye3);
        vec3 normal = normalize(vNormalEye);

        // diffuse lightning
        // for calculating phi we don't need to divide by length because length is 1 (normalized)
        // diffuse color should not negatively impact the lightning color
        float cosPhiDiffuse = clamp(cos(90.0 - dot(normal, lightDirectionEye)), 0.0, 1.0);
        vec3 diffuseColor = baseColor.rgb * uLightColor * cosPhiDiffuse * diffuseFactor;

        // specular lighting
        bool enableSpecular = true;
        vec3 specularColor = vec3(0.0, 0.0, 0.0);
        if(enableSpecular && diffuseFactor > 0.0) {
            vec3 reflectionDir = normalize(reflect(lightDirectionEye, normal));
            vec3 eyeDir = normalize(vVertexPositionEye3);
            // shouldn't be negative
            float cosPhi = clamp(cos(dot(reflectionDir, eyeDir)), 0.0, 1.0);
            specularColor = baseColor.rgb * uLightColor * specularMaterialColor * pow(cosPhi, shininess) * specularFactor;
        }

        vec3 color = ambientColor + diffuseColor + specularColor;
        gl_FragColor = vec4(color, 1);

    }
    else {
        gl_FragColor = vec4(baseColor, 1.0);
    }
}