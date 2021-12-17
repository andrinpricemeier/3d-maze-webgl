import { SceneLightning } from "../lightning/SceneLightning.js";
import { Player } from "../Player.js";
import { CellObject } from "../CellObject.js";
import { PlayerFigure } from "../PlayerFigure.js";

export class BetonLevel {
  constructor(
    gl,
    ctx,
    textureRepo,
    startCell,
    endCell,
    width,
    thickness,
    floorWidth,
    floorHeight,
    teapot
  ) {
    this.gl = gl;
    this.ctx = ctx;
    this.textureRepo = textureRepo;
    this.player = new Player(
      this.gl,
      this.ctx,
      startCell,
      endCell,
      width,
      thickness,
      new CellObject(new PlayerFigure(gl, ctx, 4, 4, 4)),
      floorWidth,
      floorHeight
    );
    this.floorWidth = floorWidth;
    this.floorHeight = floorHeight;
    endCell.isTrophy = true;
    this.trophy = new CellObject(teapot);
    this.trophy.setPosition(endCell.wall_x, endCell.wall_y);
  }

  addWalls(walls) {
    this.walls = walls;
  }

  addFloorWalls(floorWalls) {
    this.floorWalls = floorWalls;
  }

  addPillars(pillars) {
    this.pillars = pillars;
  }

  addFloorTiles(floorTiles) {
    this.floorTiles = floorTiles;
  }

  configureLevel() {
    for (let i = 0; i < this.walls.length; i++) {
      if (i % 10 === 0) {
        this.walls[i].setTextureName("banksy_wall");
      } else if (i % 5 === 0) {
        this.walls[i].setTextureName("beton_wall_bulletholes");
      } else {
        this.walls[i].setTextureName("beton_wall");
      }
    }
    this.floorTiles.forEach((o) => o.setTextureName("beton_floor"));
    this.floorWalls.forEach((o) => o.setTextureName("beton_floor"));
    this.pillars.forEach((o) => o.setTextureName("beton_wall"));
  }

  update() {
    this.walls.forEach((o) => o.update());
    this.floorWalls.forEach((o) => o.update());
    this.pillars.forEach((o) => o.update());
    this.floorTiles.forEach((o) => o.update());
    this.trophy.update();
    this.player.update();

    if (this.player.currentCell.isTrophy && !this.gameIsWon) {
      this.gameIsWon = true;
      console.log(
        "Wooow congratulation, you found the teapot. Don't we all <3 mazes? "
      );
    }
  }

  draw(lagFix) {
    const lights = new SceneLightning(this.gl, this.ctx.shaderProgram);
    this.player.drawView(lagFix);
    lights.setAmbientLight(0.1);
    lights.clearDiffuseLights();
    lights.addDiffuseLight(
      [this.trophy.actualObject.x, this.trophy.actualObject.y, 2],
      [1.0, 0.8, 0.0],
      0.4
    );
    lights.addDiffuseLight(
      [this.player.figure.actualObject.x, this.player.figure.actualObject.y, 3],
      [1.0, 1.0, 1.0],
      0.8
    );
    lights.draw(lagFix);
    this.walls.forEach((o) => {
      const texture = this.textureRepo.get(o.getTextureName());
      texture.activate();
      o.draw(lagFix);
      texture.deactivate();
    });
    this.floorWalls.forEach((o) => {
      const texture = this.textureRepo.get(o.getTextureName());
      texture.activate();
      o.draw(lagFix);
      texture.deactivate();
    });
    this.pillars.forEach((o) => {
      const texture = this.textureRepo.get(o.getTextureName());
      texture.activate();
      o.draw(lagFix);
      texture.deactivate();
    });
    this.floorTiles.forEach((o) => {
      const texture = this.textureRepo.get(o.getTextureName());
      texture.activate();
      o.draw(lagFix);
      texture.deactivate();
    });
    this.trophy.draw(lagFix);
    this.player.draw(lagFix);
  }
}
