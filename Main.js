import { Maze } from "./mazegen/Maze.js";
import { MazeGenerator } from "./mazegen/Eller.js";
import { SceneLightning } from "./lightning/SceneLightning.js";
import { RecursiveBacktracer } from "./mazegen/RecursiveBacktracker.js";
import { Mask } from "./mazegen/Mask.js";
import { TextureRepository } from "./TextureRepository.js";
import { Player } from "./Player.js";
import { Intro } from "./Intro.js";
import { showMazeBuilderProgress } from "./utils.js";

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
    window.requestAnimationFrame((current) => this.drawAnimated(current));
  }

  update() {
    this.player.update();
  }

  render(lagFix) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Lights always have to be set first because they build the basis for calculating the color of all pixels.
    this.lights.setAmbientLight(1.3);
    this.lights.draw();
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
    for (const wall of this.floorWalls) {
      wall.draw();
    }
    for (const floorTile of this.floorTiles) {
      floorTile.draw();
    }
    floorTexture.deactivate();
    this.player.draw(lagFix);
    //console.log(this.maze.toStringWithPlayer(this.player));
  }

  async buildMainLevel() {
    const WIDTH = 10;
    const HEIGHT = 10;
    const THICKNESS = 2;
    const MAZE_DIM = 15;
    const mask = new Mask(MAZE_DIM, MAZE_DIM);
    //const img = this.textureRepo.get("mask_cg").img;
    //mask.loadFromImage(img);
    this.maze = new Maze(MAZE_DIM, MAZE_DIM, mask);
    this.generator = new MazeGenerator();
    //this.generator.generate(this.maze);
    const backtracker = new RecursiveBacktracer();
    backtracker.on(this.maze);
    //console.log(this.maze.toString());
    const floorWidth =
      (this.maze.columns + 1) * THICKNESS + this.maze.columns * WIDTH;
    const floorHeight =
      (this.maze.rows + 1) * THICKNESS + this.maze.rows * HEIGHT;
    this.lights = new SceneLightning(this.gl, this.ctx.shaderProgram);
    this.lights.setAmbientLight(1.0);
    this.lights.addDiffuseLight(
      [floorWidth / 2, floorHeight / 2, 15],
      [0.0, 1.0, 1.0],
      1.0
    );
    this.lights.draw();
    this.player = new Player(
      this.gl,
      this.ctx,
      this.maze.start_cell(),
      WIDTH,
      THICKNESS
    );
    this.floorTiles = this.maze.getFloorTiles(
      this.gl,
      this.ctx,
      WIDTH,
      WIDTH,
      THICKNESS,
      THICKNESS,
      HEIGHT
    );
    this.walls = this.maze.getWalls(
      this.gl,
      this.ctx,
      WIDTH,
      HEIGHT,
      THICKNESS,
      0,
      true
    );
    this.floorWalls = this.maze.getWalls(
      this.gl,
      this.ctx,
      WIDTH,
      THICKNESS,
      THICKNESS,
      HEIGHT,
      false
    );
    this.pillars = this.maze.getPillars(
      this.gl,
      this.ctx,
      THICKNESS,
      HEIGHT,
      THICKNESS,
      WIDTH
    );
    /*
    await showMazeBuilderProgress(
      this.gl,
      this.ctx,
      this.textureRepo,
      floorWidth,
      floorHeight,
      this.walls,
      this.pillars,
      this.floorTiles,
      15,
      2000
    );*/
  }

  async readyToDraw(repo) {
    const intro = new Intro(this.gl, this.ctx, this.textureRepo);
    //await intro.play();
    await this.buildMainLevel();
    // Init for the normal draw cycle
    this.lights = new SceneLightning(this.gl, this.ctx.shaderProgram);
    window.requestAnimationFrame((current) => this.drawAnimated(current));
  }
}
