"use strict";

import GameBoard from "./GameBoard.js";
import Game from "./Game.js";
import Settings from "./Settings.js";

// DOC
let docSection = document.querySelector("section");
let maxTreasures = document.getElementById("treasure___max");
let btnBeginner = document.getElementById("btn---settings___beginner");
let btnIntermediate = document.getElementById("btn---settings___intermediate");
let btnExpert = document.getElementById("btn---settings___expert");
let btnCustom = document.getElementById("btn---settings___custom");

let gameBoard;
let game;

let values;

const settings = new Settings();

// EVENTLISTENER - GAME MODE
btnBeginner.addEventListener("click", () => {
    values = {
        size: 10,
        treasure: 3,
        walls: 10,
        hearts: 3,
        speed: 150,
    };

    startGame(values);
});

btnIntermediate.addEventListener("click", () => {
    values = {
        size: 20,
        treasure: 10,
        walls: 60,
        hearts: 2,
        speed: 125,
    };

    startGame(values);
});

btnExpert.addEventListener("click", () => {
    values = {
        size: 30,
        treasure: 20,
        walls: 150,
        hearts: 2,
        speed: 125,
    };

    startGame(values);
});

btnCustom.addEventListener("click", () => {
    settings.validateAllValues();

    values = settings.getSettings();
    startGame(values);
});

function startGame(values) {
    if (game) {
        game.resetEvents();
    }

    docSection.classList.add("hide");
    document.querySelector("main").classList.remove("hide");
    document.getElementById("end-screen").classList.add("hide");

    // Create game
    maxTreasures.innerHTML = values.treasure;
    gameBoard = new GameBoard(values.size, values.treasure);
    game = new Game(
        gameBoard,
        values.walls,
        values.treasure,
        values.hearts,
        values.speed
    );
}

document
    .getElementById("question___option---yes")
    .addEventListener("click", () => {
        startGame(values);
    });
