"use strict";

/*
 *
 */
class Player {
    frogs = 4;
    inGame = 0;
    birth = null;
    males = [];

    constructor(color, computer) {
        this.computer = computer;
        this.color = color;
    }

    resetMales() {
        for (let i = 0; i < 6; i++) {
            this.males[i] = false;
        }
    }
};

