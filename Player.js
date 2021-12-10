class Player {
  constructor(startCell, camera) {
    this.currentCell = startCell;
    this.camera = camera;
    this.pressed = {};
    this.handled = {
      "ArrowLeft": false,
      "ArrowUp": false,
      "ArrowRight": false,
      "ArrowDown": false,
      "KeyA": false,
      "KeyW": false,
      "KeyD": false,
      "KeyS": false,
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
      UP: 1,
      RIGHT: 2,
      DOWN: 3,
      LEFT: 4
    };
    this.rotation = {
      CLOCKWISE: 1,
      COUNTERCLOCKWISE: 2
    };
    this.hookupEventListeners();
    //this.camera.setPosition(this.currentCell.column, this.currentCell.row, 0);
  }

  //Regelmässig
  updatePosition(elapsed) {
    //direction = getDirection
    const direction = this.getDirection();

    if(direction !== -1){
      if(this.canMoveTo(direction)){
        this.move(direction)
      }
    }
  }

  move(direction) {
    // Move
    if(direction === this.direction.UP){
      this.currentCell = this.currentCell.north;
    }
    else if(direction === this.direction.RIGHT){
      this.currentCell = this.currentCell.east;
    }
    else if(direction === this.direction.DOWN){
      this.currentCell = this.currentCell.south;
    }
    else if(direction === this.direction.LEFT){
      this.currentCell = this.currentCell.west;
    }
    this.camera.setPosition(this.currentCell.column, this.currentCell.row, 0);
    // this.currentCell = ...
    // this.camera.positionTo oder was auch immer
  }

  getDirection(){
    if(this.isDown(this.key.UP)){
      return this.direction.UP;
    }
    else if(this.isDown(this.key.RIGHT)){
      return this.direction.RIGHT;
    }
    else if(this.isDown(this.key.DOWN)){
      return this.direction.DOWN;
    }
    else if(this.isDown(this.key.LEFT)){
      return this.direction.LEFT;
    }
    return -1;
  }

  // Nur Zelle zu zelle
  canMoveTo(direction) {
    if(direction === this.direction.UP){
      return this.currentCell.isLinkedNorth();
    }
    else if(direction === this.direction.RIGHT){
      return this.currentCell.isLinkedEast();
    }
    else if(direction === this.direction.DOWN){
      return this.currentCell.isLinkedSouth();
    }
    else if(direction === this.direction.LEFT){
      return this.currentCell.isLinkedWest();
    }
  }

  draw(gl) {}

  hookupEventListeners() {
    window.addEventListener("keydown", this.onKeydown, false);
    window.addEventListener("keyup", this.onKeyup, false);
  }

  isDown = (keyCode) => {
    let ret_val =  this.pressed[keyCode] !== undefined && this.pressed[keyCode] && this.handled[keyCode] !== undefined && !this.handled[keyCode];
    if(this.pressed[keyCode] !== undefined && this.pressed[keyCode]){
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
