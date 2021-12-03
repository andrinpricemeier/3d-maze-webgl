class RowState {
  constructor(starting_set) {
    this.next_set = starting_set;
    this.cells_in_set = {};
    this.set_for_cell = [];
  }

  record(set, cell) {
    this.set_for_cell[cell.column] = set;
    if (!this.cells_in_set[set]) {
      this.cells_in_set[set] = [];
    }
    this.cells_in_set[set].push(cell);
  }

  set_for(cell) {
    if (!this.set_for_cell[cell.column]) {
      this.record(this.next_set, cell);
      this.next_set++;
    }
    return this.set_for_cell[cell.column];
  }

  merge(winner, loser) {
    for (const cell of this.cells_in_set[loser]) {
      this.set_for_cell[cell.column] = winner;
      this.cells_in_set[winner].push(cell);
    }
    delete this.cells_in_set[loser];
  }

  next() {
    return new RowState(this.next_set);
  }

  each_set() {
    const result = [];
    for (const set in this.cells_in_set) {
      if (Object.prototype.hasOwnProperty.call(this.cells_in_set, set)) {
        const entry = [];
        entry.push(set);
        entry.push(this.cells_in_set[set]);
        result.push(entry);
      }
    }
    return result;
  }
}

export class MazeGenerator {
  shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  generate(grid) {
    let rowState = new RowState(0);
    for (const row of grid.getRows()) {
      for (const cell of row) {
        if (!cell.west) {
          continue;
        }
        const set = rowState.set_for(cell);
        const prior_set = rowState.set_for(cell.west);
        const should_link =
          set !== prior_set &&
          (cell.south || Math.floor(Math.random() * 2) === 0);
        if (should_link) {
          console.log("Linking");
          cell.link(cell.west);
          rowState.merge(prior_set, set);
        }
      }

      if (row[0].south) {
        const next_row = rowState.next();

        for (const entry of rowState.each_set()) {
          const set = entry[0];
          const cells = entry[1];
          const shuffled = this.shuffle(cells);
          for (let i = 0; i < shuffled.length; i++) {
            if (i === 0 || Math.floor(Math.random() * 2) === 0) {
              shuffled[i].link(shuffled[i].south);
              next_row.record(rowState.set_for(shuffled[i]), shuffled[i].south);
            }
          }
        }
        rowState = next_row;
      }
    }
  }
}