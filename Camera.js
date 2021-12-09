class Camera {
    view;

    constructor() {
        this.view = {
            eye: {x: 0, y: 0, z: 300},
            center: {x: 0, y:0, z: 0},
            up: {x:0, y: 1, z: 0}
        };
    }

    setPosition(x,y,z){
        this.view.center.x = x;
        this.view.center.y = y;
        this.view.center.z = z;
    }

    moveToPosition() {
        this.view.center.x ++;
    }
}