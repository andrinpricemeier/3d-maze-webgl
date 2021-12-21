import { Maze } from "./mazegen/Maze.js";
import { RecursiveBacktracer } from "./mazegen/RecursiveBacktracker.js";
import { Mask } from "./mazegen/Mask.js";
import { TextureRepository } from "./TextureRepository.js";
import { Scene } from "./Scene.js";
import { BetonLevel } from "./levels/BetonLevel.js";
import { MaskRepository } from "./MaskRepository.js";
import { Intro } from './Intro.js';
import { Teapot } from './objects/Teapot.js';

window.onload = main;

//var main
function main() {
  var main = new Main();
}

class Main {
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
    this.MS_PER_UPDATE = 16.6;
    this.previous = 0;
    this.lag = 0.0;
    this.startup();
  }

  startup() {
    var canvas = document.getElementById("myCanvas");
    this.gl = createGLContext(canvas);
    this.initGL();
    this.initWorld();
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

  initWorld() {
    this.textureRepo = new TextureRepository(this.gl, this.ctx.shaderProgram);
    this.textureRepo.add("beton_wall", "textures/betonwall.png");
    this.textureRepo.add("brick_wall", "textures/brickwall.png");
    this.textureRepo.add("clown_wall", "textures/clownwall.png");
    this.textureRepo.add("kandinsky_wall", "textures/kandinskywall.png");
    this.textureRepo.add("universe_wall", "textures/universewall.png");
    this.textureRepo.add("das_quadrat_wall", "textures/dasquadratwall.png");
    this.textureRepo.add("escher_wall", "textures/escherwall.png");
    this.textureRepo.add("einstein_wall", "textures/einsteinwall.png");
    this.textureRepo.add("beton_floor", "textures/betonfloor.png");
    this.textureRepo.add(
      "beton_wall_bulletholes",
      "textures/betonwallbulletholes.png"
    );
    this.textureRepo.add("banksy_wall", "textures/banksywall.png");
    this.maskRepo = new MaskRepository(this.gl, this.ctx.shaderProgram);
    this.maskRepo.add("a", "masks/a.png");
    this.maskRepo.add("b", "masks/b.png");
    this.maskRepo.add("t", "masks/t.png");
    this.maskRepo.add("cg", "masks/cg.png");
    this.textureRepo.loadAll(() => this.texturesLoaded());
  }

  drawAnimated(current) {
    const elapsed = current - this.previous;
    this.previous = current;
    this.lag += elapsed;
    while (this.lag >= this.MS_PER_UPDATE) {
      this.updateWorld();
      this.lag -= this.MS_PER_UPDATE;
    }
    this.renderWorld(this.lag / this.MS_PER_UPDATE);
    window.requestAnimationFrame((current) => this.drawAnimated(current));
  }

  updateWorld() {
    this.scene.update();
  }

  renderWorld(lagFix) {
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
    const teapot = new Teapot(this.gl, this.ctx, this.teapotAsset);
    const level = await new BetonLevel(
      this.gl,
      this.ctx,
      this.textureRepo,
      startCell,
      endCell,
      WIDTH,
      THICKNESS,
      floorWidth,
      floorHeight,
      teapot
    );
    level.addFloorTiles(floorTiles);
    level.addFloorWalls(floorWalls);
    level.addPillars(pillars);
    level.addWalls(walls);
    level.configureLevel();
    this.scene.addObjectToScene(level);
  }

  texturesLoaded() {
    this.maskRepo.loadAll(() => this.masksLoaded());
  }

  async masksLoaded() {
    const response = await fetch("assets/teapot_0.obj");
    this.teapotAsset = await response.text();
    const intro = new Intro(this.gl, this.ctx, this.textureRepo, this.maskRepo);
    await intro.play();
    this.buildMainLevel();
    window.requestAnimationFrame((current) => this.drawAnimated(current));
  }
}
