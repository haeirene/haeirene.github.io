import Cells from "./Cells.js";

export default class GameBoard {
    // Canvas
    canvas;
    ctxCanvas;

    // Gameboard
    cells;
    cols;
    rows;
    amountCells;
    amountTreasures;
    cellSize;
    cells = [];
    limit;

    // A* algorithm
    openSet = [];
    closedSet = [];
    path = [];

    start;
    end;

    constructor(amountCells, amountTreasures) {
        // General
        this.canvas = document.getElementById("spelbord");
        this.ctxCanvas = this.canvas.getContext("2d");

        // DPI
        this.accountForDPI();
        let canvasSize = this.canvas.style.width;

        // Size
        this.rows = amountCells;
        this.cols = amountCells;
        this.limit = Number(canvasSize.replace("px", ""));
        this.cellSize = this.limit / amountCells;
        this.amountCells = amountCells;
        this.amountTreasures = amountTreasures;

        this.cells = new Cells(this.ctxCanvas, amountCells);
    }

    /**
     * Prevent downsampling of canvas.
     */
    accountForDPI() {
        const dpr = window.devicePixelRatio || 1;

        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctxCanvas.scale(dpr, dpr);

        // Reset the canvas display size
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
    }

    /**
     * Generate walls and treasures.
     * Draw cells visually.
     * @param {*} numWalls
     * @param {*} numTreasures
     * @param {*} enemy
     * @param {*} player
     */
    draw(numWalls, numTreasures, enemy, player) {
        // Generate all cells
        this.cells.generateCells("wall", numWalls, enemy, player);
        this.cells.generateCells("treasure", numTreasures, enemy, player);

        this.ctxCanvas.lineWidth = this.amountCells >= 20 ? 2 : 4;

        // Draw game board
        for (const row of this.cells.getCells()) {
            for (const cell of row) {
                this.ctxCanvas.beginPath();
                this.ctxCanvas.rect(
                    cell.getX() * this.cellSize,
                    cell.getY() * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
                this.cells.fillCell(cell.getCategory());
                this.ctxCanvas.closePath();
            }
        }
    }

    /**
     * Draw enemy/player depending on param object.
     * @param {*} character
     */
    drawCharacter(character) {
        this.removePrevCharacter(character);
        this.drawNewCharacter(character);
    }

    removePrevCharacter(character) {
        // Hide previous field of character
        this.ctxCanvas.beginPath();
        this.ctxCanvas.rect(
            character.getPrevX() * this.cellSize,
            character.getPrevY() * this.cellSize,
            this.cellSize,
            this.cellSize
        );
        this.cells.fillCell("grass");
        this.ctxCanvas.closePath();
    }

    drawNewCharacter(character) {
        let radius = this.cellSize / 2;

        // New field for character
        this.ctxCanvas.beginPath();
        this.ctxCanvas.arc(
            character.getX() * this.cellSize + radius,
            character.getY() * this.cellSize + radius,
            radius,
            0,
            2 * Math.PI
        );

        this.ctxCanvas.strokeStyle = "rgba(0, 0, 0, 0)";
        this.ctxCanvas.fillStyle = character.getColor();
        this.ctxCanvas.fill();
        this.ctxCanvas.stroke();
        this.ctxCanvas.closePath();
    }

    getAmountOfCells() {
        return this.amountCells;
    }

    getCellSize() {
        return this.cellSize;
    }

    /**
     * A* algorithm used by the enemy to search for the player.
     * @param {*} enemy
     * @param {*} player
     * @returns array path that has all cells between the enemy and player
     */
    search(enemy, player) {
        // INITIALIZE AND/OR RESET
        this.start = this.cells.findCell(enemy.getX(), enemy.getY());
        this.end = this.cells.findCell(player.getX(), player.getY());

        this.path = [];
        this.closedSet = [];
        this.openSet = [];

        for (const row of this.cells.getCells()) {
            for (const cell of row) {
                cell.setF(0);
                cell.setG(0);
                cell.setH(0);
                cell.setPrevious(undefined);
            }
        }

        this.openSet.push(this.start);

        // START ALGORITHM
        // As long as we have cells to evaluate, we keep going.
        while (this.openSet.length > 0) {
            let winnerIndex = 0;
            for (let i = 0; i < this.openSet.length; i++) {
                if (this.openSet[i].getF() < this.openSet[winnerIndex].getF()) {
                    winnerIndex = i;
                }
            }

            let current = this.openSet[winnerIndex];

            if (current === this.end) {
                let temp = current;
                this.path.push(temp);

                while (temp.getPrevious()) {
                    this.path.push(temp.getPrevious());
                    temp = temp.getPrevious();
                }

                // Reverses the element in the array - from start (enemy) to finish (player)
                return this.path.reverse();
            }

            this.openSet.splice(winnerIndex, 1);
            this.closedSet.push(current);

            let neighbors = current.getNeighbors();
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];

                if (
                    this.closedSet.includes(neighbor) ||
                    neighbor.getCategory() === "wall" ||
                    neighbor.getCategory() === "treasure"
                ) {
                    continue;
                } else {
                    let tempG = current.getG() + 1;

                    if (!this.openSet.includes(neighbor)) {
                        this.openSet.push(neighbor);
                    } else if (tempG >= neighbor.getG()) {
                        continue;
                    }

                    neighbor.setG(tempG);
                    neighbor.setH(this.heuristic(neighbor, this.end));
                    neighbor.setF(neighbor.getG() + neighbor.getH());
                    neighbor.setPrevious(current);
                }
            }
        }

        return [];
    }

    /**
     * Evaluate heuristic by checking the distance
     * @param {*} position0 neighbor
     * @param {*} position1 end (player)
     * @returns
     */
    heuristic(position0, position1) {
        let d1 = Math.abs(position1.x - position0.x);
        let d2 = Math.abs(position1.y - position0.y);

        return d1 + d2;
    }

    /**
     * Return max amount of treasures in the gameboard
     * @returns
     */
    getTreasure() {
        return this.amountTreasures;
    }

    /**
     * Returns a collection of cells aka. the cells class.
     * @returns
     */
    getCells() {
        return this.cells;
    }
}
