class Camera {
    view;

    constructor() {
        this.view = {
            eye: {x: 0, y: 0, z: 0},
            center: {x: 0, y:0, z: 0},
            up: {x:0, y: 1, z: 0}
        };

        this.orientations = {
            NORTH: 0,
            EAST: 1,
            SOUTH: 2,
            WEST: 3
        }

        this.orientation = this.orientations.NORTH;

        this.directions =
        [0 , -100,
        100, 0,
        0, 100,
        -100, 0]
        this.direction = this.getDirection();
    }

    setPosition(x,y,z){
        this.view.eye.x = x;
        this.view.eye.y = 0;
        this.view.eye.z = z; //500
        this.view.center.x = this.view.eye.x + this.direction.x;
        this.view.center.y = this.view.eye.y + this.direction.y;
        this.view.center.z = this.view.eye.z + this.direction.z;
        console.log(this.view)
    }

    getDirection(){
        return {
            x: this.directions[this.orientation * 2],
                y: 0,
            z: this.directions[this.orientation * 2 + 1],
        }
    }

    rotateClockwise() {
        this.orientation = (this.orientation + 1) % 4;
        this.direction = this.getDirection();
    }

    rotateCounterClockwise() {
        this.orientation =  ((4 + this.orientation - 1) % 4);
        this.direction = this.getDirection();
    }
}