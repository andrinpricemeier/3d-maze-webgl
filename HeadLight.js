
export class HeadLight {
    constructor(gl, ctx, startCell, wallWidth, wallThickness, figure, floorWidth, floorHeight) {
        this.gl = gl;
        this.ctx = ctx;
        this.currentCell = startCell;
        this.floorWidth = floorWidth;
        this.floorHeight = floorHeight;
        this.figure = figure;
        this.figure.setPosition(startCell.wall_x, startCell.wall_y);
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
            Digit3: false,
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
            Key2: "Digit2",
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
        this.gl = gl;
        this.ctx = ctx;
        this.startCell = startCell;
        this.wallWidth = wallWidth;
        this.wallThickness = wallThickness;
        this.personView = new ThirdPersonView(
            gl,
            ctx,
            startCell,
            wallWidth,
            wallThickness
        );
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
        this.figure.setPosition(this.currentCell.wall_x, this.currentCell.wall_y);
        this.figure.update();
    }

    updateView() {
        if (this.isDown(this.key.Key1)) {
            this.personView = new FirstPersonView(
                this.gl,
                this.ctx,
                this.startCell,
                this.wallWidth,
                this.wallThickness
            );
        } else if (this.isDown(this.key.Key2)) {
            this.personView = new BirdsEyeView(
                this.gl,
                this.ctx,
                this.floorWidth,
                this.floorHeight
            );
        } else if (this.isDown(this.key.Key3)) {
            this.personView = new ThirdPersonView(
                this.gl,
                this.ctx,
                this.startCell,
                this.wallWidth,
                this.wallThickness
            );
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
        } else if (
            this.personView.orientation === this.personView.orientations.EAST
        ) {
            return ">";
        } else if (
            this.personView.orientation === this.personView.orientations.SOUTH
        ) {
            return "v";
        } else if (
            this.personView.orientation === this.personView.orientations.WEST
        ) {
            return "<";
        }
    }

    drawView(lagFix) {
        this.personView.draw(lagFix);
    }

    draw(lagFix) {
        this.figure.draw(lagFix);
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
