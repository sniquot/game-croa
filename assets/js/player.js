"use strict";

/*
 *
 */
class Player {
    static count = 0;
    frogs = 4;
    inGame = 0;
    males = [];
    id = 0;

    constructor(color, computer) {
        this.computer = computer;
        this.color = color;
        this.id = Player.count++;
    }

    resetMales() {
        for (let i = 0; i < 6; i++) {
            this.males[i] = false;
        }
    }

    /*
     *
     */
    drawMales() {
        let image = ``;

        for (let i = 0; i < this.frogs; i++) {
            image += `<img src="` + IMG_PATH + `frog_${this.color}.png" class="extra${this.color}" alt="Extra ${this.color} Frog">`;
        }

        for (let i = 0; i < 6; i++) {
            let cssclass = ``;
            if (this.males[i]) { cssclass = `active`; }
            image += `<img src="` + IMG_PATH + `mini5${i}.png" id="${this.color + i}" class="mini ${cssclass}" alt="Male ${this.color} ${cssclass}">`;
        }

        let element = document.getElementById("male");
        element.innerHTML = image;
    }


};

