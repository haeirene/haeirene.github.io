import Player from "./Player.js";
import Enemy from "./Enemy.js";

export default class Game {
    // HTML DOC
    docMain = document.querySelector("main");
    docTreasure = document.getElementById("treasure___player");
    docHearts = document.getElementById("hearts___player");

    // GAME LOGIC
    boundHandleMovePlayer;
    gameBoard;
    player;
    enemy;
    pathEnemy = [];
    interval;
    speed;

    constructor(gameBoard, numWalls, numTreasures, numHearts, speed) {
        // Gameboard
        this.gameBoard = gameBoard;
        this.speed = speed;
        let limit = this.gameBoard.getAmountOfCells();

        // Create player and show player info in DOC
        this.player = new Player(limit, 4, 7, numHearts);
        this.docTreasure.innerHTML = this.player.getTreasure();
        this.docHearts.innerHTML = this.player.getHearts();

        // Enemy
        this.enemy = new Enemy(limit, 4, 3);

        // Draw gameboard & players
        this.gameBoard.draw(numWalls, numTreasures, this.player, this.enemy);
        gameBoard.drawCharacter(this.player);
        gameBoard.drawCharacter(this.enemy);

        // Event handlers
        this.events();
        setTimeout(() => this.handleMoveEnemy(), 2000);
    }

    /**
     * Reset eventlisteners
     */
    resetEvents() {
        // Remove previous event listener before adding a new one
        document.removeEventListener("keydown", this.boundHandleMovePlayer);

        clearInterval(this.interval);
    }

    /**
     * A collection of all eventlisteners
     */
    events() {
        // Bind handleMovePlayer to preserve 'this' context and store it
        this.boundHandleMovePlayer = this.handleMovePlayer.bind(this);

        // Add the event listener with the bound function
        document.addEventListener("keydown", this.boundHandleMovePlayer);
    }

    /**
     * All functions that need to be triggered when moving the player.
     * @param {} event
     */
    handleMovePlayer(event) {
        let nextX = this.player.getX();
        let nextY = this.player.getY();

        switch (event.code) {
            case "ArrowUp":
            case "KeyW":
                nextY -= 1;
                break;
            case "ArrowLeft":
            case "KeyA":
                nextX -= 1;
                break;
            case "ArrowDown":
            case "KeyS":
                nextY += 1;
                break;
            case "ArrowRight":
            case "KeyD":
                nextX += 1;
                break;
        }

        let cell = this.gameBoard.getCells().findCell(nextX, nextY);

        this.movePlayer(cell, nextX, nextY);
        this.detectTreasureCollision(cell);
        this.handleMoveEnemy();

        // End screen - all treasures found
        if (this.player.getTreasure() === this.gameBoard.getTreasure()) {
            this.endGame(true);
        }
    }

    /**
     * Trigger all functions to calculate how the enemy moves.
     */
    handleMoveEnemy() {
        // Get path of A* algorithm
        this.pathEnemy = this.gameBoard.search(this.enemy, this.player);

        let index = 0;
        let lengthPathEnemey = this.pathEnemy.length;

        // RESET
        clearInterval(this.interval);

        this.interval = setInterval(() => {
            console.log("MOVE");
            // Only move enemy if they are not in cooldown
            if (this.enemy.getIsEnabled()) {
                if (index < lengthPathEnemey) {
                    this.enemy.updatePrevLocations();
                    this.enemy.updateCurrentLocation(
                        this.pathEnemy[index].getX(),
                        this.pathEnemy[index].getY()
                    );
                    this.gameBoard.drawCharacter(this.enemy);

                    this.detectEnemyCollision(
                        this.player.getX(),
                        this.player.getY()
                    );
                }

                if (index === lengthPathEnemey) {
                    clearInterval(this.interval);

                    // If player isn't moving, the enemy will auto move in 2 seconds.
                    setTimeout(() => this.handleMoveEnemy(), 2000);
                }

                index++;
            }
        }, this.speed);

        if (!this.enemy.getIsEnabled()) {
            this.gameBoard.drawCharacter(this.enemy);
        }
    }

    /**
     * Detect collision between enemy and player
     * @param {*} nextX player's new x-coordinate
     * @param {*} nextY player's new y-coordinate
     */
    detectEnemyCollision(nextX, nextY) {
        if (this.enemy.getX() === nextX && this.enemy.getY() === nextY) {
            this.enemy.setIsEnabled(false); // Cooldown enemy
            this.player.decreaseHearts();
            this.docHearts.innerHTML = this.player.getHearts();

            this.player.flashColor();

            // End screen - there are no heart anymore
            if (this.player.getHearts() === 0) {
                this.endGame(false);
            }
        }
    }

    /**
     * Check if the player can move to the chosen tile.
     * @param {*} cell
     * @param {*} nextX player's new x-coordinate
     * @param {*} nextY player's new y-coordinate
     */
    movePlayer(cell, nextX, nextY) {
        if (cell.getCategory() !== "wall") {
            this.player.updatePrevLocations();
            this.player.updateCurrentLocation(nextX, nextY);
            this.gameBoard.drawCharacter(this.player);
        }
    }

    /**
     * Detect if player has gotten any treasure.
     * @param {*} cell
     */
    detectTreasureCollision(cell) {
        if (cell.getCategory() === "treasure") {
            this.player.increaseTreasure();
            this.docTreasure.innerHTML = this.player.getTreasure();
            cell.setCategory("grass"); // Cell is not a treasure anymore
        }
    }

    /**
     * Show end screen depending on if it's a win or lose
     * @param {*} isWinner boolean
     */
    endGame(isWinner) {
        // Remove game
        this.resetEvents();

        // Add score screen
        let container = document.querySelector(".message---info");

        let h2 = document.getElementById("message---title");
        let emoji = document.getElementById("emoji");

        if (isWinner) {
            emoji.innerHTML = "🍗";
            container.classList.add("winner");
            h2.innerHTML = "winner winner, chicken dinner";
        } else {
            emoji.innerHTML = "😕";
            container.classList.add("lost");
            h2.innerHTML = "so close, yet so far away";
        }

        document.getElementById("end-screen").classList.remove("hide");
        document.querySelector("main").classList.add("hide");
        container.classList.remove("hide");
    }
}
