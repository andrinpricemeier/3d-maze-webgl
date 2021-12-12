import { Maze } from "./maze.js";
import { MazeGenerator } from "./MazeGenerator.js";
import { TextureRepository } from "./TextureRepository.js";
import { Camera } from "./Camera.js";
import { Wall } from "./Wall.js";
import { Floor } from './Floor.js';
import { OrthographicProjection } from "./OrthographicProjection.js";
import { SceneLightning } from "./SceneLightning.js";
import { Player } from './Player.js';
import { BirdsEyeView } from './BirdsEyeView.js';

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
    this.textureRepo.add("wall", "textures/wall.png");
    this.textureRepo.add("floor", "textures/floor.png");
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
    const wallTexture = this.textureRepo.get("wall");
    wallTexture.activate();
    for (const wall of this.walls) {
      wall.draw();
    }
    for (const pillar of this.pillars) {
      pillar.draw();
    }
    const floorTexture = this.textureRepo.get("floor");
    floorTexture.activate();
    this.floor.draw();
    floorTexture.deactivate();
    this.player.draw(lagFix);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async showMazeBuilderProgress(floorWidth, floorHeight, speedInMs, endWaitInMs) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    const birdsEyeView = new BirdsEyeView(this.gl, this.ctx, floorWidth, floorHeight);
    birdsEyeView.update();
    birdsEyeView.draw();
    this.lights.setup(this.gl, this.ctx.shaderProgram);
    const floorTexture = this.textureRepo.get("floor");
    const wallTexture = this.textureRepo.get("wall");
    const allWalls = this.walls.length;
    for (let wallIndex = 0; wallIndex < allWalls; wallIndex++) {
      let i = 0;
      for (const wall of this.walls) {
        if (i > wallIndex) {
          break;
        }
        floorTexture.activate();
        this.floor.draw();
        wallTexture.activate();
        wall.draw();
        i++;
      }
      // Using async apparently confuses WebGL (?)
      // That's why we draw incrementally.
      await this.sleep(speedInMs);
    }
    floorTexture.activate();
    this.floor.draw();
    for (const wall of this.walls) {
      wallTexture.activate();
      wall.draw();
    }
    for (const pillar of this.pillars) {
      pillar.draw();
    }
    floorTexture.deactivate();
    await this.sleep(endWaitInMs);
  }

  async readyToDraw(repo) {   
    const WIDTH = 10;
    const HEIGHT = 10;
    const THICKNESS = 2;
    this.maze = new Maze(5, 5);
    this.generator = new MazeGenerator();
    this.generator.generate(this.maze);
    console.log(this.maze.toString());
    this.lights = new SceneLightning();
    this.player = new Player(this.gl, this.ctx, this.maze.start_cell(), WIDTH, THICKNESS);
    const floorWidth = (this.maze.columns + 1) * THICKNESS + this.maze.columns * WIDTH;
    const floorHeight = (this.maze.rows + 1) * THICKNESS + this.maze.rows * HEIGHT;
    this.floor = new Floor(this.gl, this.ctx, floorWidth, floorHeight, THICKNESS);
    this.walls = this.maze.getWalls(this.gl, this.ctx, WIDTH, HEIGHT, THICKNESS);
    this.pillars = this.maze.getPillars(this.gl, this.ctx, THICKNESS, HEIGHT, THICKNESS, WIDTH);
    await this.showMazeBuilderProgress(floorWidth, floorHeight, 150, 2000);
    window.requestAnimationFrame(current => this.drawAnimated(current));
  }
}
