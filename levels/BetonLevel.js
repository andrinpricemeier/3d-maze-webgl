import { SceneLightning } from "../lightning/SceneLightning.js";
import { Player } from "../Player.js";
import { CellObject } from "../CellObject.js";
import { PlayerFigure } from "../PlayerFigure.js";
import { Trophy } from "../Trophy.js";

export class BetonLevel {
  constructor(gl, ctx, textureRepo, startCell, endCell, width, thickness, floorWidth, floorHeight) {
    this.gl = gl;
    this.ctx = ctx;
    this.textureRepo = textureRepo;
    this.lights = new SceneLightning(this.gl, this.ctx.shaderProgram);
    this.player = new Player(this.gl, this.ctx, startCell, width, thickness, new CellObject(new PlayerFigure(gl, ctx, 4, 4, 4)), floorWidth, floorHeight);
    this.trophy = new CellObject(new Trophy(gl, ctx, 4, 4, 4));
    this.trophy.setPosition(endCell.wall_x, endCell.wall_y);
    endCell.isTrophy = true;
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
    for (let i = 0; i < this.floorTiles.length; i++) {
      if (i % 10 === 0) {
        this.floorTiles[i].setTextureName("blue_beton_floor");
      } else {
        this.floorTiles[i].setTextureName("beton_floor");
      }
    }
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
  }

  draw(lagFix) {
    this.lights.setAmbientLight(1.0);
    this.lights.addDiffuseLight([0, 0, 5], [1.0, 1.0, 1.0], 0.03);
    this.lights.draw(lagFix);
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
