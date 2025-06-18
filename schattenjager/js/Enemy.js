import Character from "./Character.js";

export default class Enemy extends Character {
    isEnabled;

    constructor(limit, x, y) {
        super(limit, x, y);
        this.isEnabled = true;
        this.category = "enemy";
        this.color = "#000";
    }

    setIsEnabled(value) {
        this.isEnabled = value;

        setTimeout(() => {
            this.setIsEnabled(true);
        }, 2000);
    }

    getIsEnabled() {
        return this.isEnabled;
    }
}
