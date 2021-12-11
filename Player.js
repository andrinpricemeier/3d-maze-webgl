export class Player {
  constructor(startCell, camera) {
    this.currentCell = startCell;
    this.camera = camera;
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
    this.hookupEventListeners();
  }

  //Regelmässig
  update() {
    //direction = getDirection
    const direction = this.getDirection();
    const rotation = this.getRotation();

    if (direction !== -1) {
      if (this.canMoveTo(direction)) {
        this.move(direction);
      }
    }

    /*if (rotation !== -1) {
      this.rotate(rotation);
    }*/
    
    this.camera.setPosition(this.currentCell.wall_x, this.currentCell.wall_y);
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

  rotate(rotation) {
    // Rotate

    if (rotation === this.rotation.CLOCKWISE) {
      this.camera.rotateClockwise();
    } else if (rotation === this.rotation.COUNTERCLOCKWISE) {
      this.camera.rotateCounterClockwise();
    }
    this.camera.setPosition(this.currentCell.column, 0, this.currentCell.row);
  }

  getDirection() {
    /*if (this.isDown(this.key.W)) {
      return (this.direction.UP + this.camera.orientation) % 4;
    } else if (this.isDown(this.key.RIGHT)) {
      return (this.direction.RIGHT + this.camera.orientation) % 4;
    } else if (this.isDown(this.key.DOWN)) {
      return (this.direction.DOWN + this.camera.orientation) % 4;
    } else if (this.isDown(this.key.LEFT)) {
      return (this.direction.LEFT + this.camera.orientation) % 4;
    }*/
    if (this.isDown(this.key.W)) {
      return this.direction.UP;
    } else if (this.isDown(this.key.D)) {
      return this.direction.RIGHT;
    } else if (this.isDown(this.key.S)) {
      return this.direction.DOWN;
    } else if (this.isDown(this.key.A)) {
      return this.direction.LEFT;
    }
    return -1;
  }

  getRotation() {
    if (this.isDown(this.key.D)) {
      return this.rotation.CLOCKWISE;
    } else if (this.isDown(this.key.A)) {
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
    if (this.camera.orientation === this.camera.orientations.NORTH) {
      return "^";
    } else if (this.camera.orientation === this.camera.orientations.EAST) {
      return ">";
    } else if (this.camera.orientation === this.camera.orientations.SOUTH) {
      return "v";
    } else if (this.camera.orientation === this.camera.orientations.WEST) {
      return "<";
    }
  }

  draw(lagFix) {
    this.camera.draw();
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
