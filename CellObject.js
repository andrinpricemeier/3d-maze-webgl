export class CellObject {
    constructor(actualObject) {
        this.actualObject = actualObject;
    }

    setPosition(wall_x, wall_y) {
        this.wall_x = wall_x;
        this.wall_y = wall_y;        
        const new_x = 2 + (this.wall_x + 1) * 2 + this.wall_x * 10 + 3;
        const new_y = 2 + (this.wall_y + 1) * 2 + this.wall_y * 10 + 3;
        this.actualObject.setCoordinates(new_x, new_y, -5);
    }

    setXRotation(x) {
        this.actualObject.setXRotation(x);
    }

    update() {
        this.actualObject.update();
    }

    draw(lagFix) {        
        this.actualObject.draw(lagFix);
    }
}