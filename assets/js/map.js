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
        console.log('dragoverHandler');
        if (this.classList.contains("inPath")) {
            event.preventDefault();
        }
    }

    /*
     *
     */
    static dropHandler(event) {
        console.log('dropHandler');
        if (this.classList.contains("inPath")) {
            Game.moveFrog(this.pos);
            Game.actionFrog(this.pos);
        }
    }

    /*
     *
     */
    static makeTable() {
        let table = '';
        let posY = 0;

        table += '<tr><td id="male" class="male" colspan="' + Map.mapWidth + '"></td></tr>';

        for (let y = 0; y < Map.mapHeight; y++) {
            posY = y * Map.mapWidth;
            table += "<tr>";
            for (let x = 0; x < Map.mapWidth; x++) {
                table += `<td id=\"m${posY + x}\" class=\"cellMap b${Map.data[posY + x].back}\"></td>`;
            }
            table += "</tr>";
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
