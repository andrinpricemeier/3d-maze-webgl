class Player {
  constructor(startCell, camera) {
    this.currentCell = startCell;
    this.camera = camera;
    this.pressed = {};
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
  }

  update() {
    //direction = getDirection
    const direction = 1;
    if (this.canMoveTo(direction)) {
      this.move(direction);
    }
  }

  move(direction) {
    // this.currentCell = ...
    // this.camera.positionTo oder was auch immer
  }

  canMoveTo(direction) {
    return true;
  }

  draw(gl) {}

  hookupEventListeners() {
    window.addEventListener("keydown", this.onKeydown, false);
    window.addEventListener("keyup", this.onKeyup, false);
  }

  isDown = (keyCode) => {
    return this.pressed[keyCode] !== undefined && this.pressed[keyCode];
  };

  onKeydown = (event) => {
    this.pressed[event.code] = true;
  };

  onKeyup = (event) => {
    this.pressed[event.code] = false;
  };
}
