"use strict";

/*
 *
 */
class Frog {
    constructor() {
        this.player = 0;
        this.isQueen = false;
        this.mud = 0;
        this.pos = 0;
        this.name = '';
        this.id = '';
    }

    /*
 *
 */
    static newFrog(pos, ply, isQueen) {
        let frg = new Frog;

        frg.player = ply;
        frg.name = Frog.getName();
        frg.isQueen = isQueen;
        frg.id = 'frog' + game.nbFrogs++;
        frg.pos = pos;

        return frg;
    }

    /*
     * Retourne le nom d'une grenouille
     */
    static getName() {
        let index = Math.floor(Math.random() * names.length);
        let name = names[index];

        return name;
    }
};





/*
 *
 */
function getFrogById(id) {
    for (let i = 0; i < game.frogs.length; i++) {
        if (game.frogs[i].id === id)
            return game.frogs[i];
    }
    return null;
}

/*
 *
 */
function getFrogByPos(pos) {
    for (let i = 0; i < game.frogs.length; i++) {
        if (game.frogs[i].pos === pos)
            return game.frogs[i];
    }
    return null;
}

/*
 *
 */
function drawFrogs() {
    game.frogs.forEach(frog => {
        removeFrog(frog);
        drawFrog(frog);
    });
}

/*
 *
 */
function removeFrog(frog) {
    if (frog !== null) {
        let img = document.getElementById(frog.id);
        if (img)
            img.parentElement.removeChild(img);
    }
}

/*
 *
 */
function drawFrog(frog) {
    if (frog !== null) {
        let img = document.createElement('img');

        let sPrefix = (frog.isQueen) ? 'queen_' : 'frog_';
        let sColor = sPrefix + `${colors[frog.player]}.png`;

        img.src = IMG_PATH + sColor;
        img.className = 'imgFrog';
        img.draggable = true;
        img.title = frog.name;
        img.id = frog.id;

        img.ondragstart = function (event) {
            console.log('ondragstart');
            game.dragData = getFrogById(event.target.id);
            game.dragCell = this.parentNode;
            drawPath(true);
        };

        img.ondragend = function (event) {
            console.log('ondragend');
            drawPath(false);
        };

        Map.getCell(frog.pos).appendChild(img);
    }
}



/*
 *
 */
function killFrog(frog) {
    game.frogs = game.frogs.filter(frg => {
        if (frg.id === frog.id) {
            game.players[frog.player].inGame--;
            game.players[frog.player].frogs++;

            removeFrog(frg);
            showTile(frg.pos, false);
            return false;
        } else return true;
    });
}
