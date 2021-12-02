class RowState {
    constructor(starting_set) {
        this.next_set = starting_set
        this.cells_in_set = {}
        this.set_for_cell = []
    }

    record(set, cell) {
        this.set_for_cell[cell.column] = set
        if (this.cells_in_set[set] !== undefined) {
            this.cells_in_set[set] = []
            this.cells_in_set[set].append(cell);
        }
    }

    set_for(cell) {
        if (this.set_for_cell[cell.column] === undefined) {
            this.record(this.next_set, cell);
            this.next_set++;
        }
        return this.set_for_cell[cell.column];
    }

    merge(winner, loser) {
        for (const cell of this.cells_in_set[loser]) {
            this.set_for_cell[cell.column] = winner;
            this.cells_in_set[winner].append(cell);
        }
        this.cells_in_set.remove(loser);
    }

    next() {
        return new RowState(this.next_set);
    }

    each_set() {
        const result = [];
        for (const )
    }

    /*
ef next
RowState.new(@next_set)
end
def each_set
@cells_in_set.each { |set, cells| yield set, cells }
self
end
    */
}

export class MazeGenerator {
    
}