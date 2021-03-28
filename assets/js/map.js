"use strict";

/*
 *
 */
class Map {
    static mapHeight = 8;
    static mapWidth = 8;
    static mapSize = Map.mapHeight * Map.mapWidth;

    static data = [];
    static cells = [];

    /*
     *
     */
    static reset() {
        for (let x = 0; x < Map.mapSize; x++) {
            Map.data[x] = dalles[x];
        }

        Stuff.shuffleArray(Map.data);
    }

    /*
     *
     */
    static drawMap() {
        let html = Map.makeTable();
        let element = document.getElementById("map");
        element.textContent = ``;
        element.insertAdjacentHTML("afterbegin", html);
        Map.initCells();
    }

    /*
     *
     */
    static initCells() {
        let cells = document.getElementsByClassName("cellMap");
        let pos = 0;

        for (let cell of cells) {
            cell.pos = pos++;
            cell.ondragover = Map.dragoverHandler;
            cell.ondrop = Map.dropHandler;
            Map.cells.push(cell);
        };
    }

    /*
     *
     */
    static dragoverHandler(event) {
        //console.log('dragoverHandler');
        if (this.classList.contains("inPath")) {
            event.preventDefault();
        }
    }

    /*
     *
     */
    static dropHandler(event) {
        //console.log('dropHandler');
        if (this.classList.contains("inPath")) {
            Game.moveFrog(this.pos);
            Game.actionFrog(this.pos);
            Game.save(0);
        }
    }

    /*
     *
     */
    static makeTable() {
        let table = '';
        let posY = 0;

        table += '<div id="male" class="male"></div>';

        for (let y = 0; y < Map.mapHeight; y++) {
            posY = y * Map.mapWidth;
            table += '<div class="divRow">';
            for (let x = 0; x < Map.mapWidth; x++) {
                table += `<div id=\"m${posY + x}\" class=\"divCell cellMap b${Map.data[posY + x].back}\" ></div>`;
            }
            table += "</div>";
        }

        return table;
    }

    /*
     *
     */
    static getCell(pos) {
        return Map.cells[pos];
    }

    /*
     *
     */
    static showTile(pos, bVisible) {
        let sType;
        let cell = Map.getCell(pos);

        if (!Game.memory && bVisible == false)
            return;

        Map.data[pos].visible = bVisible;
        if (Map.data[pos].visible) {
            if (Map.data[pos].type === TYPE_MALE) {
                sType = 'type' + (Map.data[pos].type) + (Map.data[pos].data);
            } else {
                sType = 'type' + (Map.data[pos].type);
            }
            cell.style.backgroundImage = "url('" + IMG_PATH + sType + ".png')";

        } else {
            cell.style.backgroundImage = "";
        }
    }

    /*
     *
     */
    static showTiles() {
        let sType;
        for (let i = 0; i < Map.data.length; i++) {
            if (Map.data[i].visible) {
                if (Map.data[i].type === TYPE_MALE) {
                    sType = 'type' + (Map.data[i].type) + (Map.data[i].data);
                } else {
                    sType = 'type' + (Map.data[i].type);
                }
                Map.cells[i].style.backgroundImage = "url('" + IMG_PATH + sType + ".png')";
            }
            else {
                Map.cells[i].style.backgroundImage = "";
            }
        }

    }

    /*
     *
     */
    static checkMove(posBefore, posAfter) {
        const move = [9, 8, 7, 1];
        let diff = Math.abs(posAfter - posBefore);
        let bMove = (move.indexOf(diff) >= 0) ? true : false;
        if (!bMove) {
            return false;
        }

        let posBx = (posBefore % Map.mapWidth);
        let posAx = (posAfter % Map.mapWidth);
        let diffx = Math.abs(posBx - posAx);
        if (diffx > 1)
            return false;

        return true;
    }
};
