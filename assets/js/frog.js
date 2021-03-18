"use strict";

/*
 *
 */
class Frog {
    static count = 0;

    mud = 0;
    name = '';
    id = '';

    constructor(pos, ply, isQueen) {
        this.player = ply;
        this.isQueen = isQueen;
        this.pos = pos;
        this.id = 'frog' + Frog.count++;
        this.name = Frog.getName();
    }

    /*
     * Retourne le nom d'une grenouille
     */
    static getName() {
        let index = Math.floor(Math.random() * names.length);
        let name = names[index];

        return name;
    }

    /*
     *
     */
    remove() {
        let img = document.getElementById(this.id);
        if (img)
            img.parentElement.removeChild(img);
    }
    /*
     *
     */
    draw() {
        let img = document.createElement('img');

        let sPrefix = (this.isQueen) ? 'queen_' : 'frog_';
        let sColor = sPrefix + `${colors[this.player]}.png`;

        img.src = IMG_PATH + sColor;
        img.className = 'imgFrog';
        img.draggable = true;
        img.title = this.name;
        img.id = this.id;

        img.ondragstart = (event) => {
            //console.log('ondragstart');
            Game.dragPos = this.pos;
            this.drawPath(true);
        };

        img.ondragend = (event) => {
            //console.log('ondragend');
            this.drawPath(false);
        };

        Map.getCell(this.pos).appendChild(img);
    }

    /*
    *
    */
    isStuck() {
        if (this.mud !== 0 && this.mud > Game.turn) {
            return true;
        }

        return false;
    }

    /*
     *
     */
    drawPath(bVisible) {

        if (bVisible && (Game.currentPlayer.id !== this.player || !this.aBirth() || this.isStuck() || !this.isNenuphar())) {
            return;
        }

        let min = this.pos - 10;
        let max = this.pos + 10;
        let count = 0;

        if (min < 0)
            min = 0;
        if (max > Map.mapSize)
            max = Map.mapSize;

        for (let i = min; i < max; i++) {
            let cellDropable = Map.getCell(i);
            if (bVisible) {
                if (Map.checkMove(this.pos, i)) {
                    // Cas Nénuphar on ignore la dernière position
                    if (!(Game.nenuphar !== null && Game.nenuphar.id === this.id)) {
                        // Juste les cases vides ou les joueurs adverses
                        if (Game.freeSpaceAtPos(i)) {
                            cellDropable.classList.add("inPath");
                            count++;
                        }
                    }
                }
            } else {
                cellDropable.classList.remove("inPath");
            }
        }

        // Cas Nénuphar : Si pas de déplacement possible on autorise le retour en arrière.
        if (Game.nenuphar !== null && bVisible && count == 0) {
            Map.getCell(Game.lasPos).classList.add("inPath");
        }
    }


    /*
    *
    */
    isNenuphar() {
        if (Game.nenuphar !== null) {
            if (this.id === Game.nenuphar.id)
                return true;
            else return false;
        }
        return true;
    }

    /*
     *
     */
    aBirth() {
        if (Game.birth !== null && Game.currentPlayer.id === Game.birth.player && Game.currentPlayer.id === this.player) {
            if (this.pos === Game.birth.pos) {
                return true;
            } else return false;
        }
        return true;
    }

};

