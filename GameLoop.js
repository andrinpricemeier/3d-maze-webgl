"use strict";

import { MazeGenerator } from "./MazeGenerator.js";
import { Maze } from "./Maze.js";

window.onload = startup;
var gl;

var ctx = {
  shaderProgram: -1,
  aVertexPositionId : -1
};

function startup() {
  var canvas = document.getElementById("myCanvas");
  gl = createGLContext(canvas);
  initGL();
  draw();
}

function initGL() {
  ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
  setUpAttributesAndUniforms();
  setUpBuffers();
  gl.clearColor(0.5,0.5,0.6,1);
}

function setUpAttributesAndUniforms(){
  ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
}

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  const maze = new Maze(5, 5);
  const generator = new MazeGenerator();
  generator.generate(maze);
  const floor = new Floor(200, 200, 2, ctx.aVertexPositionId);
  floor.draw(gl);
}
