import { shuffle } from '../utils.js';

class RowState {
  constructor(starting_set) {
    this.next_set = starting_set;
    this.cells_in_set = new Map();
    this.set_for_cell = new Map();
  }

  record(set, cell) {
    this.set_for_cell.set(cell.column, set);
    if (!this.cells_in_set.has(set)) {
      this.cells_in_set.set(set, []);
    }
    this.cells_in_set.get(set).push(cell);
  }

  set_for(cell) {
    if (!this.set_for_cell.has(cell.column)) {
      this.record(this.next_set, cell);
      this.next_set++;
    }
    return Number(this.set_for_cell.get(cell.column));
  }

  merge(winner, loser) {
    for (const cell of this.cells_in_set.get(loser)) {
      this.set_for_cell.set(cell.column, winner);
      this.cells_in_set.get(winner).push(cell);
    }
    this.cells_in_set.delete(loser);
  }

  next() {
    return new RowState(this.next_set);
  }

  each_set() {
    const result = [];
    for (const entry of this.cells_in_set.entries()) {
        result.push(entry);
    }
    return result;
  }
}

export class MazeGenerator {
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
          (!cell.south || Math.floor(Math.random() * 2) === 0);
        if (should_link) {
          cell.link(cell.west, true);
          rowState.merge(prior_set, set);
        }
      }
      if (row[0].south) {
        const next_row = rowState.next();
        for (const entry of rowState.each_set()) {
          const set = entry[0];
          const cells = entry[1];
          const shuffled = shuffle(cells);
          for (let i = 0; i < shuffled.length; i++) {
            if (i === 0 || Math.floor(Math.random() * 3) === 0) {
              shuffled[i].link(shuffled[i].south, true);
              next_row.record(rowState.set_for(shuffled[i]), shuffled[i].south);
            }
          }
        }
        rowState = next_row;
      }
    }
  }
}
