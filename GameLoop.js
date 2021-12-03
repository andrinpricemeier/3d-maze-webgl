import { MazeGenerator } from "./MazeGenerator.js";
import { Maze } from "./Maze.js";
export class GameLoop {
  constructor() {
    const maze = new Maze(15, 15);
    const generator = new MazeGenerator();
    generator.generate(maze);
    console.log(maze.toString());
  }
}

const loop = new GameLoop();
