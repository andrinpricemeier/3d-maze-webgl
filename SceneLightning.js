import { AmbientLight } from './AmbientLight.js';
import { DiffuseLight } from './DiffuseLight.js';
import { SpecularLight } from './SpecularLight.js';

export class SceneLightning {
    setup(gl, shaderProgram) {
        const ambient = new AmbientLight();
        ambient.setup(gl, shaderProgram);

        const enableLights = gl.getUniformLocation(shaderProgram, "uEnableLighting");   
        gl.uniform1i(enableLights, 1);
        

        const diffuseLights = [];
        const diffuseLight1 = new DiffuseLight();
        diffuseLight1.setup(gl, shaderProgram, 0, [0, 0, 5], [1.0, 1.0, 1.0], 0.5);
        diffuseLights.push(diffuseLight1);
        const numberOfDiffuseLights = gl.getUniformLocation(shaderProgram, "numberOfDiffuseLights");   
        gl.uniform1i(numberOfDiffuseLights, diffuseLights.length);

        const specularLights = [];
        const specularLight1 = new SpecularLight();
        specularLight1.setup(gl, shaderProgram, 0, [0, 0, 5], [1.0, 1.0, 1.0], 0.5, [0.4, 0.4, 0.4], 5.0);
        specularLights.push(specularLight1);
        const numberOfSpecularLights = gl.getUniformLocation(shaderProgram, "numberOfSpecularLights");   
        gl.uniform1i(numberOfSpecularLights, specularLights.length);
    }
}