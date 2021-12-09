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
    this.direction = {
      UP: 1,
      RIGHT: 2,
      DOWN: 3,
      LEFT: 4
    };
    this.hookupEventListeners();
  }

  //Regelmässig
  updatePosition(elapsed) {
    //direction = getDirection
    const direction = 1;

    if(this.isDown(this.key.UP)){
      console.log("is down");
      this.move(null);
    }
  }

  move(direction) {
    // Move
    this.camera.setPosition(this.currentCell.x, this.currentCell.y, this.currentCell.z);
    // this.currentCell = ...
    // this.camera.positionTo oder was auch immer
  }


  // Nur Zelle zu zelle
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
