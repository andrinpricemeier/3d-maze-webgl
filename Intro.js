import { Maze } from "./maze.js";
import { MazeGenerator } from "./MazeGenerator.js";
import { Floor } from "./Floor.js";
import { SceneLightning } from "./SceneLightning.js";
import { Player } from "./Player.js";
import { RecursiveBacktracer } from "./RecursiveBacktracker.js";
import { Mask } from "./Mask.js";
import { showMazeBuilderProgress } from "./utils.js";

export class Intro {
  constructor(gl, ctx, textureRepo) {
    this.gl = gl;
    this.ctx = ctx;
    this.textureRepo = textureRepo;
  }

  async play() {
    await this.showAndrin();
    await this.showBoas();
    await this.showTobias();
  }

  async showAndrin() {
    await this.show("mask_a", [1.0, 0.0, 0.0]);
  }

  async showBoas() {
    await this.show("mask_b", [1.0, 1.0, 0.0]);
  }

  async showTobias() {
    await this.show("mask_t", [1.0, 0.0, 1.0]);
  }

  async show(maskName, lightColor) {
    const WIDTH = 10;
    const HEIGHT = 10;
    const THICKNESS = 2;
    const MAZE_DIM = 15;
    const mask = new Mask(MAZE_DIM, MAZE_DIM);
    const img = this.textureRepo.get(maskName).img;
    mask.loadFromImage(img);
    this.maze = new Maze(MAZE_DIM, MAZE_DIM, mask);
    this.generator = new MazeGenerator();
    //this.generator.generate(this.maze);
    const backtracker = new RecursiveBacktracer();
    backtracker.on(this.maze);
    console.log(this.maze.toString());
    const floorWidth =
      (this.maze.columns + 1) * THICKNESS + this.maze.columns * WIDTH;
    const floorHeight =
      (this.maze.rows + 1) * THICKNESS + this.maze.rows * HEIGHT;
    this.lights = new SceneLightning(this.gl, this.ctx.shaderProgram);
    this.lights.setAmbientLight(1.0);
    this.lights.addDiffuseLight(
      [floorWidth / 2, floorHeight / 2, 15],
      lightColor,
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
    this.floor = new Floor(
      this.gl,
      this.ctx,
      floorWidth,
      floorHeight,
      THICKNESS,
      HEIGHT
    );
    this.walls = this.maze.getWalls(
      this.gl,
      this.ctx,
      WIDTH,
      HEIGHT,
      THICKNESS
    );
    this.pillars = this.maze.getPillars(
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
      this.walls,
      this.pillars,
      this.floor,
      15,
      2000
    );
  }
}
