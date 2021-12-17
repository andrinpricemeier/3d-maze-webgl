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

    loadFromImage(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
          for (let colIndex = 0; colIndex < this.columns; colIndex++) {
            const pixel = canvas.getContext('2d').getImageData(colIndex, rowIndex, 1, 1).data;
            if (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0) {
              this.setIsOn(rowIndex, colIndex, false);
            }
          }
        }
    }

    count() {
        let count = 0;
        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            for (let colIndex = 0; colIndex < this.columns; colIndex++) {
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