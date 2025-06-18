export default class Cell {
    id;
    x;
    y;
    category;

    // A* algorithm
    previous;
    neighbors;
    f;
    g;
    h;

    constructor(id, x, y, category) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.category = category;
        this.neighbors = [];
        this.previous = undefined;
    }

    setPrevious(previous) {
        this.previous = previous;
    }

    setF(f) {
        this.f = f;
    }

    setH(h) {
        this.h = h;
    }

    setG(g) {
        this.g = g;
    }

    getPrevious() {
        return this.previous;
    }

    setCategory(category) {
        this.category = category;
    }

    // A* algorithm
    addNeighbors(grid, gridSize) {
        if (this.x < gridSize - 1) {
            this.neighbors.push(grid[this.x + 1][this.y]);
        } else {
            this.neighbors.push(grid[0][this.y]);
        }

        if (this.x > 0) {
            this.neighbors.push(grid[this.x - 1][this.y]);
        } else {
            this.neighbors.push(grid[gridSize - 1][this.y]);
        }

        if (this.y < gridSize - 1) {
            this.neighbors.push(grid[this.x][this.y + 1]);
        } else {
            this.neighbors.push(grid[this.x][0]);
        }

        if (this.y > 0) {
            this.neighbors.push(grid[this.x][this.y - 1]);
        } else {
            this.neighbors.push(grid[gridSize - 1][this.y]);
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getF() {
        return this.f;
    }

    getG() {
        return this.g;
    }

    getH() {
        return this.h;
    }

    getCategory() {
        return this.category;
    }

    getNeighbors() {
        return this.neighbors;
    }
}
