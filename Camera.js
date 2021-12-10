class Camera {
    view;

    constructor() {
        this.view = {
            eye: {x: 0, y: 0, z: 0},
            center: {x: 0, y:0, z: 0},
            up: {x:0, y: 1, z: 0}
        };
        this.direction = {
            x: 0,
            y: 0,
            z: -100,
        }
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

    moveToPosition() {
        this.view.center.x ++;
    }
}