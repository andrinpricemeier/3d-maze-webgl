import { SceneLightning } from "../lightning/SceneLightning.js";
import { Player } from "../Player.js";

export class BetonLevel {
  constructor(gl, ctx, textureRepo, startCell, width, thickness) {
    this.gl = gl;
    this.ctx = ctx;
    this.textureRepo = textureRepo;
    this.lights = new SceneLightning(this.gl, this.ctx.shaderProgram);
    this.player = new Player(this.gl, this.ctx, startCell, width, thickness);
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
    this.walls.forEach((o) => o.setTextureName("wall"));
    this.floorWalls.forEach((o) => o.setTextureName("floor"));
    this.pillars.forEach((o) => o.setTextureName("wall"));
    this.floorTiles.forEach((o) => o.setTextureName("floor"));
  }

  update() {
    this.walls.forEach((o) => o.update());
    this.floorWalls.forEach((o) => o.update());
    this.pillars.forEach((o) => o.update());
    this.floorTiles.forEach((o) => o.update());
    this.player.update();
  }

  draw(lagFix) {
    this.lights.setAmbientLight(1.0);
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
    this.player.draw(lagFix);
  }
}
