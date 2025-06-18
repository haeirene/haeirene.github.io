export default class Character {
    limit;
    x;
    y;
    prevX;
    prevY;
    category;
    color;

    constructor(limit, x, y) {
        this.limit = limit - 1;
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
    }

    updatePrevLocations() {
        this.prevY = this.y;
        this.prevX = this.x;
    }

    updateCurrentLocation(x, y) {
        if (x > this.limit) {
            this.x = 0;
        } else if (x < 0) {
            this.x = this.limit;
        } else {
            this.x = x;
        }

        if (y > this.limit) {
            this.y = 0;
        } else if (y < 0) {
            this.y = this.limit;
        } else {
            this.y = y;
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getPrevX() {
        return this.prevX;
    }

    getPrevY() {
        return this.prevY;
    }

    getCategory() {
        return this.category;
    }

    getColor() {
        return this.color;
    }
}
