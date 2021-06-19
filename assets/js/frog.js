"use strict";

/*
 *
 */
class Frog {
    static count = 0;

    mud = 0; // 
    name = '';
    id = 0;
    img = null;
    pos = 0;
    isQueen = false;
    player = 0;

    constructor(pos, ply, isQueen) {
        this.player = ply;
        this.isQueen = isQueen;
        this.pos = pos;
        this.id = Frog.count++;
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
        if (this.img !== null)
            this.img.parentElement.removeChild(this.img);
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

        img.ondragstart = (event) => {
            console.log('ondragstart');
            Game.dragFrog = this;
            this.drawPath(this.pos, true);
        };

        img.ondragend = (event) => {
            console.log('ondragend');
            this.drawPath(Game.lastPos, false);
        };
        this.img = img;

        Map.getCell(this.pos).appendChild(img);
    }

    /*
    *
    */
    isStuck() {
        let pos = Map.getCell(this.pos);
        if (this.mud !== 0 && this.mud > Game.turn) {
            return true;
        }
        this.img.classList.remove("mud");
        return false;
    }

    /*
     *
     */
    drawPath(pos, bVisible) {
        //console.log('drawPath');
        if (bVisible && (Game.currentPlayer.id !== this.player || !this.aBirth() || this.isStuck() || !this.isNenuphar())) {
            return;
        }

        let min = pos - 10;
        let max = pos + 10;
        let count = 0;

        if (min < 0)
            min = 0;
        if (max > Map.mapSize)
            max = Map.mapSize;

        for (let i = min; i < max; i++) {
            let cellDropable = Map.getCell(i);
            if (bVisible) {
                if (Map.checkMove(pos, i)) {
                    // Cas Nénuphar on ignore la dernière position
                    if (!Game.nenuphar || (i !== Game.lastPos)) {
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

