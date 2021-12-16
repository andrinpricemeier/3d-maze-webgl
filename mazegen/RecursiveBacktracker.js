export class RecursiveBacktracer {
    on(grid) {
        const start_at = grid.random_cell();
        const stack = [];
        stack.unshift(start_at);
        while (stack.length > 0) {
            const current = stack[0];
            const neighbours = [];
            for (const n of current.neighbours()) {
                if (n.links.size === 0) {
                    neighbours.push(n);
                }
            }
            if (neighbours.length === 0) {
                stack.shift();
            } else {
                const neighbor = neighbours[Math.floor(Math.random()*neighbours.length)];
                current.link(neighbor, true);
                stack.unshift(neighbor);
            }
        }
        return grid;
    }
}