import { Maze } from "./maze.js";
import { MazeGenerator } from "./MazeGenerator.js";
import { TextureRepository } from "./TextureRepository.js";
import { Camera } from "./Camera.js";
import { Wall } from "./Wall.js";
import { Floor } from './Floor.js';
import { OrthographicProjection } from "./OrthographicProjection.js";
import { SceneLightning } from "./SceneLightning.js";
import { Player } from './Player.js';

window.onload = main;

//var main
function main() {
  var main = new Main();
}

class Main {
  gl;
  previousTimestamp;

  // objects
  wiredCube;
  solidCubeRight;

  matrices;
  camera;
  player;
  light;
  ctx;

  textures;
  colors;

  maze;
  generator;

  constructor() {
    this.ctx = {
      shaderProgram: -1,
      aVertexPositionId: -1,
      aVertexColorId: -1,
      aVertexNormalId: -1,
      aVertexTextureCoordId: -1,
      uModelMatrixId: -1,
      uModelNormalMatrix: -1,
    };
    this.startup();
  }

  startup() {
    var canvas = document.getElementById("myCanvas");
    this.gl = createGLContext(canvas);
    this.initGL();
    this.draw();
  }

  initGL() {
    this.ctx.shaderProgram = loadAndCompileShaders(
      this.gl,
      "VertexShader.glsl",
      "FragmentShader.glsl"
    );
    this.setUpAttributesAndUniforms();
    this.gl.frontFace(this.gl.CCW);
    this.gl.cullFace(this.gl.BACK);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(0.3, 0.3, 0.3, 1);
  }

  setUpAttributesAndUniforms() {
    this.ctx.aVertexPositionId = this.gl.getAttribLocation(
      this.ctx.shaderProgram,
      "aVertexPosition"
    );
    this.ctx.aVertexColorId = this.gl.getAttribLocation(
      this.ctx.shaderProgram,
      "aVertexColor"
    );
    this.ctx.aVertexNormalId = this.gl.getAttribLocation(
      this.ctx.shaderProgram,
      "aVertexNormal"
    );
    this.ctx.aVertexTextureCoordId = this.gl.getAttribLocation(
      this.ctx.shaderProgram,
      "aVertexTextureCoord"
    );
    this.ctx.uModelMatrixId = this.gl.getUniformLocation(
      this.ctx.shaderProgram,
      "uModelMatrix"
    );
    this.ctx.uModelNormalMatrixId = this.gl.getUniformLocation(
      this.ctx.shaderProgram,
      "uModelNormalMatrix"
    );
  }

  draw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    const textureRepo = new TextureRepository(this.gl, this.ctx.shaderProgram);
    textureRepo.add("lena", "textures/lena512.png");
    textureRepo.add("wall", "textures/wall.png");
    textureRepo.loadAll(() => this.readyToDraw(textureRepo));
  }

  readyToDraw(repo) {   
    this.maze = new Maze(5, 5);
    this.generator = new MazeGenerator();
    this.generator.generate(this.maze);
    console.log(this.maze.toString());
    const lights = new SceneLightning();
    lights.setup(this.gl, this.ctx.shaderProgram);
    const camera = new Camera(this.gl, this.ctx.shaderProgram);
    const player = new Player(this.maze.start_cell(), camera);
    player.move(0);
    const projection = new OrthographicProjection(
      this.gl,
      this.ctx.shaderProgram
    );
    projection.draw();
    const wall = repo.get("wall");
    wall.activate();
    const WIDTH = 10;
    const HEIGHT = 10;
    const THICKNESS = 2;
    const floorWidth = (this.maze.columns + 1) * THICKNESS + this.maze.columns * WIDTH;
    const floorHeight = (this.maze.rows + 1) * THICKNESS + this.maze.rows * HEIGHT;
    const floor = new Floor(this.gl, this.ctx, floorWidth, floorHeight, THICKNESS);
    floor.draw();
    for (const wall of this.maze.getWalls(this.gl, this.ctx, WIDTH, HEIGHT, THICKNESS)) {
      wall.draw();
    }
  }
}
