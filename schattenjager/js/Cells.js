import Cell from "./Cell.js";

export default class Cells {
    ctxCanvas;

    cells = [];
    rows;
    cols;

    /**
     * Collection of each tile in the grid.
     * @param {*} ctxCanvas
     * @param {*} amountCells
     */
    constructor(ctxCanvas, amountCells) {
        this.ctxCanvas = ctxCanvas;

        this.rows = amountCells;
        this.cols = amountCells;

        this.makeCells();
    }

    /**
     * Make a grid of size rows x cols.
     * Each cell contains a grass cell.
     *
     * After making each cell, go again through all cells and add the neighbors to each cell.
     * This is necessary for the A* algorithm.
     */
    makeCells() {
        for (let i = 0; i < this.cols; i++) {
            this.cells[i] = new Array(this.rows);
        }

        let index = 0;
        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            for (let colIndex = 0; colIndex < this.rows; colIndex++) {
                this.cells[rowIndex][colIndex] = new Cell(
                    index,
                    rowIndex,
                    colIndex,
                    "grass"
                );

                index++;
            }
        }

        for (const row of this.cells) {
            for (const cell of row) {
                cell.addNeighbors(this.cells, this.rows);
            }
        }
    }

    /**
     * Choose random cells that are selected to be a category (wall or treasure).
     *
     * By randomizing, the gameboard never looks the same as the previous time.
     */
    generateCells(category, max, enemy, player) {
        let counter = 0;

        while (counter < max) {
            let randomX = Math.floor(Math.random() * this.rows);
            let randomY = Math.floor(Math.random() * this.cols);

            if (
                this.cells[randomX][randomY].getCategory() === "grass" &&
                randomX !== enemy.getX() &&
                randomX !== player.getX() &&
                randomY !== enemy.getY() &&
                randomY !== player.getY()
            ) {
                let amountWallNeighbors = 0;

                // Make certain that each treasure is accessible
                if (category === "treasure") {
                    let neighbors = this.cells[randomX][randomY].getNeighbors();
                    amountWallNeighbors = neighbors.filter(
                        (neighbor) => neighbor.getCategory() === "wall"
                    ).length;
                }

                if (amountWallNeighbors <= 2) {
                    this.cells[randomX][randomY].setCategory(category);
                    counter++;
                }
            }
        }
    }

    /**
     * Find the cell by x- and y-coordinate.
     * @param {*} x x-coordinate
     * @param {*} y y-coordinate
     * @returns If found, return cell. If not, return empty object.
     */
    findCell(x, y) {
        if (x < 0) {
            x = this.rows - 1;
        }

        if (x > this.rows - 1) {
            x = 0;
        }

        if (y < 0) {
            y = this.cols - 1;
        }

        if (y > this.cols - 1) {
            y = 0;
        }

        for (const row of this.cells) {
            for (const cell of row) {
                if (cell.getX() === x && cell.getY() === y) {
                    return cell;
                }
            }
        }

        return {};
    }

    /**
     * Fill the cell's color depending on category.
     * @param {*} category : category name
     */
    fillCell(category) {
        // Colors
        let colorGrass = "#4BE189";
        let colorTreasure = "#FFE283";
        let colorWall = "#EB3E06";

        switch (category) {
            case "grass":
                this.ctxCanvas.fillStyle = colorGrass;
                break;
            case "wall":
                this.ctxCanvas.fillStyle = colorWall;
                break;
            case "treasure":
                this.ctxCanvas.fillStyle = colorTreasure;
                break;
            default:
                this.ctxCanvas.fillStyle = colorGrass;
                break;
        }

        this.ctxCanvas.strokeStyle = "#38a967";
        this.ctxCanvas.fill();
        this.ctxCanvas.stroke();
    }

    /**
     * Return the cells of the gameboard.
     * @returns this.cells
     */
    getCells() {
        return this.cells;
    }
}
