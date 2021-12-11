import { AmbientLight } from './AmbientLight.js';
import { DiffuseLight } from './DiffuseLight.js';
import { SpecularLight } from './SpecularLight.js';

export class SceneLightning {
    setup(gl, shaderProgram) {
        const ambient = new AmbientLight();
        ambient.setup(gl, shaderProgram);

        const diffuseLights = [];
        const diffuseLight1 = new DiffuseLight();
        diffuseLight1.setup(gl, shaderProgram, 0, [0, 10, 5], [1.0, 1.0, 1.0], 2.0);
        diffuseLights.push(diffuseLight1);
        const numberOfDiffuseLights = gl.getUniformLocation(shaderProgram, "numberOfDiffuseLights");   
        gl.uniform1i(numberOfDiffuseLights, diffuseLights.length);

        const specularLights = [];
        const specularLight1 = new SpecularLight();
        specularLight1.setup(gl, shaderProgram, 0, [0, 10, 5], [1.0, 1.0, 1.0], 2.0, [0.4, 0.4, 0.4], 2.0);
        specularLights.push(specularLight1);     
        const specularLight2 = new SpecularLight();
        specularLight2.setup(gl, shaderProgram, 1, [0, -10, 5], [1.0, 1.0, 1.0], 2.0, [0.4, 0.4, 0.4], 2.0);
        specularLights.push(specularLight2); 
        const numberOfSpecularLights = gl.getUniformLocation(shaderProgram, "numberOfSpecularLights");   
        gl.uniform1i(numberOfSpecularLights, specularLights.length);
    }
}