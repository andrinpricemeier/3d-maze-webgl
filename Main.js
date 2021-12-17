import { Maze } from "./mazegen/Maze.js";
import { MazeGenerator } from "./mazegen/Eller.js";
import { SceneLightning } from "./lightning/SceneLightning.js";
import { RecursiveBacktracer } from "./mazegen/RecursiveBacktracker.js";
import { Mask } from "./mazegen/Mask.js";
import { TextureRepository } from "./TextureRepository.js";
import { Player } from "./Player.js";
import { Intro } from "./Intro.js";
import { showMazeBuilderProgress } from "./utils.js";
import { Scene } from './Scene.js';
import { BetonLevel } from './levels/BetonLevel.js';
import { Teapot } from "./objects/Teapot.js";

window.onload = main;

//var main
function main() {
  var main = new Main();
}

class Main {
  gl;

  ctx;

  maze;

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
    this.textureRepo.add("beton_wall", "textures/beton_wall.png");
    this.textureRepo.add("beton_floor", "textures/beton_floor.png");
    this.textureRepo.add("beton_wall_bulletholes", "textures/beton_wall_bulletholes.png");
    this.textureRepo.add("banksy_wall", "textures/banksy_wall.png");
    this.textureRepo.add("blue_beton_floor", "textures/blue_beton_floor.png");
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
    window.requestAnimationFrame((current) => this.drawAnimated(current));
  }

  update() {
    this.scene.update();
  }

  render(lagFix) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.scene.draw(lagFix);
  }

  async buildMainLevel() {
    const WIDTH = 10;
    const HEIGHT = 10;
    const THICKNESS = 2;
    const MAZE_DIM = 15;
    const mask = new Mask(MAZE_DIM, MAZE_DIM);
    this.maze = new Maze(MAZE_DIM, MAZE_DIM, mask);
    const backtracker = new RecursiveBacktracer();
    backtracker.on(this.maze);
    const floorWidth =
      (this.maze.columns + 1) * THICKNESS + this.maze.columns * WIDTH;
    const floorHeight =
      (this.maze.rows + 1) * THICKNESS + this.maze.rows * HEIGHT;
    const floorTiles = this.maze.getFloorTiles(
      this.gl,
      this.ctx,
      WIDTH,
      WIDTH,
      THICKNESS,
      THICKNESS,
      HEIGHT
    );
    const walls = this.maze.getWalls(
      this.gl,
      this.ctx,
      WIDTH,
      HEIGHT,
      THICKNESS,
      0,
      true
    );
    const floorWalls = this.maze.getWalls(
      this.gl,
      this.ctx,
      WIDTH,
      THICKNESS,
      THICKNESS,
      HEIGHT,
      false
    );
    const pillars = this.maze.getPillars(
      this.gl,
      this.ctx,
      THICKNESS,
      HEIGHT,
      THICKNESS,
      WIDTH
    );
    this.scene = new Scene();
    const startCell = this.maze.start_cell();
    const endCell = this.maze.end_cell(startCell);
    const level = await new BetonLevel(this.gl, this.ctx, this.textureRepo, startCell, endCell, WIDTH, THICKNESS, floorWidth, floorHeight);
    level.addFloorTiles(floorTiles);
    level.addFloorWalls(floorWalls);
    level.addPillars(pillars);
    level.addWalls(walls);
    level.configureLevel();
    this.scene.addObjectToScene(level);
  }

  readyToDraw(repo) {
    this.textureRepo = repo;
    this.buildMainLevel();
    window.requestAnimationFrame((current) => this.drawAnimated(current));
  }
}
