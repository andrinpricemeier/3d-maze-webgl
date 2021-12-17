import { Maze } from "./mazegen/Maze.js";
import { SceneLightning } from "./lightning/SceneLightning.js";
import { RecursiveBacktracer } from "./mazegen/RecursiveBacktracker.js";
import { Mask } from "./mazegen/Mask.js";
import { showMazeBuilderProgress } from "./utils.js";

export class Intro {
  constructor(gl, ctx, textureRepo, maskRepo) {
    this.gl = gl;
    this.ctx = ctx;
    this.textureRepo = textureRepo;
    this.maskRepo = maskRepo;
  }

  async play() {
    await this.showAndrin();
    await this.showBoas();
    await this.showTobias();
    await this.showCG();
  }

  async showAndrin() {
    await this.show("a", [1.0, 0.0, 0.0]);
  }

  async showBoas() {
    await this.show("b", [1.0, 1.0, 0.0]);
  }

  async showTobias() {
    await this.show("t", [1.0, 0.0, 1.0]);
  }

  async showCG() {
    await this.show("cg", [0.0, 1.0, 1.0]);
  }

  async show(maskName, lightColor) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    const WIDTH = 10;
    const HEIGHT = 10;
    const THICKNESS = 2;
    const MAZE_DIM = 15;
    const mask = new Mask(MAZE_DIM, MAZE_DIM);
    const img = this.maskRepo.get(maskName).img;
    mask.loadFromImage(img);
    const maze = new Maze(MAZE_DIM, MAZE_DIM, mask);
    const backtracker = new RecursiveBacktracer();
    backtracker.on(maze);
    const floorWidth =
      (maze.columns + 1) * THICKNESS + maze.columns * WIDTH;
    const floorHeight =
      (maze.rows + 1) * THICKNESS + maze.rows * HEIGHT;
    const lights = new SceneLightning(this.gl, this.ctx.shaderProgram);
    lights.setAmbientLight(1.0);
    lights.addDiffuseLight(
      [floorWidth / 2, floorHeight / 2, 15],
      lightColor,
      1.0
    );
    lights.draw();
    const floorTiles = maze.getFloorTiles(
      this.gl,
      this.ctx,
      WIDTH,
      WIDTH,
      THICKNESS,
      THICKNESS,
      HEIGHT
    );
    const walls = maze.getWalls(
      this.gl,
      this.ctx,
      WIDTH,
      HEIGHT,
      THICKNESS,
      0,
      true
    );
    const floorWalls = maze.getWalls(
      this.gl,
      this.ctx,
      WIDTH,
      THICKNESS,
      THICKNESS,
      HEIGHT,
      false
    );
    const pillars = maze.getPillars(
      this.gl,
      this.ctx,
      THICKNESS,
      HEIGHT,
      THICKNESS,
      WIDTH
    );
    await showMazeBuilderProgress(
      this.gl,
      this.ctx,
      this.textureRepo,
      floorWidth,
      floorHeight,
      walls,
      pillars,
      floorTiles,
      floorWalls,
      10,
      2000
    );
  }
}
