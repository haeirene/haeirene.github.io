import Character from "./Character.js";

export default class Player extends Character {
    hearts;
    collectedTreasures;

    constructor(limit, x, y, hearts) {
        super(limit, x, y);

        this.collectedTreasures = 0;
        this.hearts = hearts;
        this.category = "player";
        this.color = "#FFF";
    }

    flashColor() {
        this.color = "#ff6699";

        setTimeout(() => {
            this.color = "#FFF";
        }, 2000);
    }

    increaseTreasure() {
        this.collectedTreasures++;
    }

    decreaseHearts() {
        this.hearts--;
    }

    getTreasure() {
        return this.collectedTreasures;
    }

    getHearts() {
        return this.hearts;
    }
}
