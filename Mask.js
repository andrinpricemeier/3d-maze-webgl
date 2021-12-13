export class Mask {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.bits = [];
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            this.bits.push([]);
            for (let colIndex = 0; colIndex < columns; colIndex++) {
                this.bits[rowIndex].push(true);
            }
        }
    }

    getIsOn(row, column) {
        if (row < this.bits.length && column < this.bits[row].length) {
            return this.bits[row][column];
        }
        return false;
    }

    setIsOn(row, column, value) {
        this.bits[row][column] = value;
    }

    count() {
        let count = 0;
        for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            this.bits[rowIndex] = [];
            for (let colIndex = 0; colIndex < this.columns.length; colIndex++) {
                if (this.bits[rowIndex][colIndex]) {
                    count++;
                }
            }
        }
        return count;
    }
    
    random_location() {
        while (true) {            
            const row = Math.floor(Math.random() * this.rows);
            const column = Math.floor(Math.random() * this.bits[row].length);
            if (this.bits[row][column]) {
                return [row, column];
            }
        }
    }
}