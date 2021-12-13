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
import { shuffle } from './utils.js';
import { RecursiveBacktracer } from './RecursiveBacktracker.js';
import { Mask } from './Mask.js';

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
    this.textureRepo.add("mask_g", "textures/mask_g.png");
    this.textureRepo.add("mask_cg", "textures/mask_cg.png");
    this.textureRepo.add("mask_abt", "textures/mask_abt.png");
    this.textureRepo.add("mask_rose", "textures/mask_rose.png");
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
    const floorTexture = this.textureRepo.get("floor");
    const wallTexture = this.textureRepo.get("wall");
    const allWalls = this.walls.length;
    const shuffleWalls = shuffle(this.walls);
    for (let wallIndex = 0; wallIndex < allWalls; wallIndex++) {
      let i = 0;
      for (const wall of shuffleWalls) {
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
    const MAZE_DIM = 25;
    const mask = new Mask(MAZE_DIM, MAZE_DIM);
    const img = this.textureRepo.get("mask_g").img;
    console.log(img);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    for (let rowIndex = 0; rowIndex < MAZE_DIM; rowIndex++) {
      for (let colIndex = 0; colIndex < MAZE_DIM; colIndex++) {
        const pixel = canvas.getContext('2d').getImageData(colIndex, rowIndex, 1, 1).data;
        if (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0) {
          mask.setIsOn(rowIndex, colIndex, false);
        }
      }
    }
    this.maze = new Maze(MAZE_DIM, MAZE_DIM, mask);
    this.generator = new MazeGenerator();
    //this.generator.generate(this.maze);
    const backtracker = new RecursiveBacktracer();
    backtracker.on(this.maze);
    console.log(this.maze.toString());
    const floorWidth = (this.maze.columns + 1) * THICKNESS + this.maze.columns * WIDTH;
    const floorHeight = (this.maze.rows + 1) * THICKNESS + this.maze.rows * HEIGHT;
    this.lights = new SceneLightning(this.gl, this.ctx.shaderProgram);
    this.lights.setAmbientLight(1.0);
    //this.lights.addDiffuseLight([floorWidth / 2, floorHeight / 2, 15], [1.0, 0.0, 0.0], 1.0);
    this.lights.draw();
    this.player = new Player(this.gl, this.ctx, this.maze.start_cell(), WIDTH, THICKNESS);
    this.floor = new Floor(this.gl, this.ctx, floorWidth, floorHeight, THICKNESS, HEIGHT);
    this.walls = this.maze.getWalls(this.gl, this.ctx, WIDTH, HEIGHT, THICKNESS);
    this.pillars = this.maze.getPillars(this.gl, this.ctx, THICKNESS, HEIGHT, THICKNESS, WIDTH);
    await this.showMazeBuilderProgress(floorWidth, floorHeight, 20, 15000);
    // Init for the normal draw cycle
    this.lights = new SceneLightning(this.gl, this.ctx.shaderProgram);
    window.requestAnimationFrame(current => this.drawAnimated(current));
  }
}
