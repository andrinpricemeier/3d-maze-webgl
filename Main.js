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
    this.MS_PER_UPDATE = 20;
    this.previous = 0;
    this.lag = 0.0;
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
    this.textureRepo = new TextureRepository(this.gl, this.ctx.shaderProgram);
    this.textureRepo.add("lena", "textures/lena512.png");
    this.textureRepo.add("wall", "textures/wall.png");
    this.textureRepo.add("grass", "textures/grass.png");
    this.textureRepo.loadAll(() => this.readyToDraw(this.textureRepo));
  }

  drawAnimated(current) {
    const elapsed = current - this.previous;
    this.previous = current;
    this.lag += elapsed;
    while (this.lag >= this.MS_PER_UPDATE) {
      this.update();
      this.lag -= this.MS_PER_UPDATE;
    }
    this.render(this.lag / this.MS_PER_UPDATE);
    window.requestAnimationFrame(current => this.drawAnimated(current));
  }

  update() {
    this.player.update();
  }

  render(lagFix) {    
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.lights.setup(this.gl, this.ctx.shaderProgram);
    this.projection.draw();
    const wallTexture = this.textureRepo.get("wall");
    wallTexture.activate();
    for (const wall of this.walls) {
      wall.draw();
    }
    const grassTexture = this.textureRepo.get("grass");
    grassTexture.activate();
    this.floor.draw();
    grassTexture.deactivate();
    this.player.draw(lagFix);
  }

  readyToDraw(repo) {   
    this.maze = new Maze(5, 5);
    this.generator = new MazeGenerator();
    this.generator.generate(this.maze);
    console.log(this.maze.toString());
    this.lights = new SceneLightning();
    this.camera = new Camera(this.gl, this.ctx.shaderProgram);
    this.player = new Player(this.gl, this.ctx, this.maze.start_cell(), this.camera);
    this.projection = new OrthographicProjection(
      this.gl,
      this.ctx.shaderProgram
    );
    const WIDTH = 10;
    const HEIGHT = 10;
    const THICKNESS = 2;
    const floorWidth = (this.maze.columns + 1) * THICKNESS + this.maze.columns * WIDTH;
    const floorHeight = (this.maze.rows + 1) * THICKNESS + this.maze.rows * HEIGHT;
    this.floor = new Floor(this.gl, this.ctx, floorWidth, floorHeight, THICKNESS);
    this.walls = this.maze.getWalls(this.gl, this.ctx, WIDTH, HEIGHT, THICKNESS);    
    window.requestAnimationFrame(current => this.drawAnimated(current));
  }
}
