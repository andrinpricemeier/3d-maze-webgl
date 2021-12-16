export class Scene {
    constructor() {
        this.objectsToDraw = [];
    }

    addObjectToScene(obj) {
        this.objectsToDraw.push(obj);
    }

    update() {
        this.objectsToDraw.forEach(o => o.update());
    }

    draw() {
        this.objectsToDraw.forEach(o => o.draw());
    }
}