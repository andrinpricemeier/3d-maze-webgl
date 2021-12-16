import { SolidCube } from './objects/SolidCube.js';
import { FirstPersonView } from './FirstPersonView.js';
import {ThirdPersonView} from "./ThirdPersonView.js";

export class Player {
  constructor(gl, ctx, startCell, wallWidth, wallThickness) {
    this.gl = gl;
    this.ctx = ctx;
    this.currentCell = startCell;
    this.pressed = {};
    this.handled = {
      ArrowLeft: false,
      ArrowUp: false,
      ArrowRight: false,
      ArrowDown: false,
      KeyA: false,
      KeyW: false,
      KeyD: false,
      KeyS: false,
      Digit1: false,
      Digit3: false
    };
    this.key = {
      LEFT: "ArrowLeft",
      UP: "ArrowUp",
      RIGHT: "ArrowRight",
      DOWN: "ArrowDown",
      A: "KeyA",
      W: "KeyW",
      D: "KeyD",
      S: "KeyS",
      Key1: "Digit1",
      Key3: "Digit3",
    };
    this.direction = {
      UP: 0,
      RIGHT: 1,
      DOWN: 2,
      LEFT: 3,
    };
    this.rotation = {
      CLOCKWISE: 1,
      COUNTERCLOCKWISE: 2,
    };

    this.angle = 0;
    this.cube = SolidCube(
      this.gl,
      [1.0, 0.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 0.0, 1.0],
      [1.0, 1.0, 0.0],
      [0.0, 1.0, 1.0],
      [1.0, 0.0, 1.0]
    );
    this.gl = gl;
    this.ctx = ctx;
    this.startCell = startCell;
    this.wallWidth = wallWidth;
    this.wallThickness = wallThickness;
    this.personView = new ThirdPersonView(gl, ctx, startCell, wallWidth, wallThickness);
    this.angularSpeed = (0.5 * 2 * Math.PI) / 360.0;
    this.hookupEventListeners();
  }

  //Regelmässig
  update() {
    this.updateView();
    const direction = this.getDirection();
    const rotation = this.getRotation();

    if (direction !== -1) {
      if (this.canMoveTo(direction)) {
        this.move(direction);
      }
    }

    if (rotation !== -1) {
      this.personView.rotate(rotation);
    }
    
    this.personView.update(this.currentCell, direction);

    
    this.angle += this.angularSpeed;
    if (this.angle > 2.0 * Math.PI) {
      this.angle -= 2.0 * Math.PI;
    }
  }

  updateView() {
    if (this.isDown(this.key.Key1)) {
      this.personView = new FirstPersonView(this.gl, this.ctx, this.startCell, this.wallWidth, this.wallThickness);
    }else if(this.isDown(this.key.Key3)) {
      this.personView = new ThirdPersonView(this.gl, this.ctx, this.startCell, this.wallWidth, this.wallThickness);
    }
  }

  move(direction) {
    // Move
    if (direction === this.direction.UP) {
      this.currentCell = this.currentCell.north;
    } else if (direction === this.direction.RIGHT) {
      this.currentCell = this.currentCell.east;
    } else if (direction === this.direction.DOWN) {
      this.currentCell = this.currentCell.south;
    } else if (direction === this.direction.LEFT) {
      this.currentCell = this.currentCell.west;
    }
  }

  getDirection() {
    if (this.isDown(this.key.W)) {
      return (this.direction.UP + this.personView.orientation) % 4;
    } else if (this.isDown(this.key.D)) {
      return (this.direction.RIGHT + this.personView.orientation) % 4;
    } else if (this.isDown(this.key.S)) {
      return (this.direction.DOWN + this.personView.orientation) % 4;
    } else if (this.isDown(this.key.A)) {
      return (this.direction.LEFT + this.personView.orientation) % 4;
    }
    return -1;
  }

  getRotation() {
    if (this.isDown(this.key.RIGHT)) {
      return this.rotation.CLOCKWISE;
    } else if (this.isDown(this.key.LEFT)) {
      return this.rotation.COUNTERCLOCKWISE;
    }
    return -1;
  }

  // Nur Zelle zu zelle
  canMoveTo(direction) {
    if (direction === this.direction.UP) {
      return this.currentCell.isLinkedNorth();
    } else if (direction === this.direction.RIGHT) {
      return this.currentCell.isLinkedEast();
    } else if (direction === this.direction.DOWN) {
      return this.currentCell.isLinkedSouth();
    } else if (direction === this.direction.LEFT) {
      return this.currentCell.isLinkedWest();
    }
  }

  getOrientationArrow() {
    if (this.personView.orientation === this.personView.orientations.NORTH) {
      return "^";
    } else if (this.personView.orientation === this.personView.orientations.EAST) {
      return ">";
    } else if (this.personView.orientation === this.personView.orientations.SOUTH) {
      return "v";
    } else if (this.personView.orientation === this.personView.orientations.WEST) {
      return "<";
    }
  }

  draw(lagFix) {
    this.personView.draw();
    this.angle += lagFix * this.angularSpeed;
    if (this.angle > 2.0 * Math.PI) {
      this.angle -= 2.0 * Math.PI;
    }
    //this.camera.draw();    
    const modelMatrix = mat4.create();
    const new_x = 2 + (this.currentCell.wall_x + 1) * 2 + this.currentCell.wall_x * 10 + 3;
    const new_y = 2 + (this.currentCell.wall_y + 1) * 2 + this.currentCell.wall_y * 10 + 3;
    mat4.translate(modelMatrix, modelMatrix, [new_x, new_y, -5]);    
    mat4.rotate(modelMatrix, modelMatrix, this.angle, [0, 1, 0]);
    mat4.scale(modelMatrix, modelMatrix, [
      4, 4, 4
    ]);
    this.gl.uniformMatrix4fv(this.ctx.uModelMatrixId, false, modelMatrix);
    const normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, modelMatrix);
    this.gl.uniformMatrix3fv(
      this.ctx.uModelNormalMatrixId,
      false,
      normalMatrix
    );
    this.cube.draw(
      this.gl,
      this.ctx.aVertexPositionId,
      this.ctx.aVertexColorId,
      this.ctx.aVertexTextureCoordId,
      this.ctx.aVertexNormalId
    );
  }

  hookupEventListeners() {
    window.addEventListener("keydown", this.onKeydown, false);
    window.addEventListener("keyup", this.onKeyup, false);
  }

  isDown = (keyCode) => {
    let ret_val =
      this.pressed[keyCode] !== undefined &&
      this.pressed[keyCode] &&
      this.handled[keyCode] !== undefined &&
      !this.handled[keyCode];
    if (this.pressed[keyCode] !== undefined && this.pressed[keyCode]) {
      this.handled[keyCode] = true;
    }
    return ret_val;
  };

  onKeydown = (event) => {
    this.pressed[event.code] = true;
  };

  onKeyup = (event) => {
    this.pressed[event.code] = false;
    this.handled[event.code] = false;
  };
}
