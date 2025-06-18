export default class Settings {
    inputGameBoard;
    inputTreasure;
    inputWalls;
    inputHearts;

    valGameBoard;
    valTreasure;
    valWalls;
    valHearts;

    constructor() {
        this.inputGameBoard = document.getElementById("custom---gameboard");
        this.inputTreasure = document.getElementById("custom---treasures");
        this.inputWalls = document.getElementById("custom---walls");
        this.inputHearts = document.getElementById("custom---hearts");

        this.events();
    }

    events() {
        let docGamefield = document.getElementById(
            "custom---gameboard___value"
        );
        let docTreasure = document.getElementById("custom---treasures___value");
        let docWalls = document.getElementById("custom---walls___value");
        let docMaxWalls = document.getElementById("custom---walls___max");
        let docHearts = document.getElementById("custom---hearts___value");

        this.inputGameBoard.addEventListener("input", (event) => {
            docGamefield.innerHTML = event.target.value;

            let valueDocGameField = this.validate(event.target.value, 10);

            if (valueDocGameField === 10) {
                this.inputWalls.setAttribute("max", 20);
                docMaxWalls.innerHTML = 20;
            } else if (valueDocGameField === 15) {
                this.inputWalls.setAttribute("max", 70);
                docMaxWalls.innerHTML = 70;
            } else {
                this.inputWalls.setAttribute("max", 100);
                docMaxWalls.innerHTML = 100;
            }

            if (
                Number(docWalls.innerHTML) >
                Number(this.inputWalls.getAttribute("max"))
            ) {
                docWalls.innerHTML = this.inputWalls.getAttribute("max");
            }
        });

        this.inputTreasure.addEventListener("input", (event) => {
            docTreasure.innerHTML = event.target.value;
        });

        this.inputWalls.addEventListener("input", (event) => {
            docWalls.innerHTML = event.target.value;
        });

        this.inputHearts.addEventListener("input", (event) => {
            docHearts.innerHTML = event.target.value;
        });
    }

    validateAllValues() {
        this.valGameBoard = this.validate(this.inputGameBoard.value, 10);
        this.valTreasure = this.validate(this.inputTreasure.value, 3);

        this.valWalls = this.validate(this.inputWalls.value, 10);
        this.valHearts = this.validate(this.inputHearts.value, 1);
    }

    validate(value, defaultValue) {
        if (Number(value)) {
            return Number(value);
        }

        return defaultValue;
    }

    getSettings() {
        return {
            size: this.valGameBoard,
            treasure: this.valTreasure,
            walls: this.valWalls,
            hearts: this.valHearts,
            speed: 150,
        };
    }
}
