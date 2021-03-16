"use strict";

/*
 *
 */
class Map {
    mapHeight = 8;
    mapWidth = 8;
    mapSize = this.mapHeight * this.mapWidth;
    data = []

    /*
     *
     */
    reset() {
        for (let x = 0; x < this.mapSize; x++) {
            this.data[x] = dalles[x];
        }

        Stuff.shuffleArray(game.map.data);
    }

    /*
     *
     */
    drawMap() {
        let html = this.makeTable(game.map.data);
        let element = document.getElementById("map");
        element.textContent = ``;
        element.insertAdjacentHTML("afterbegin", html);
        this.initCells();
    }
    /*
     *
     */
    initCells() {
        let cells = document.getElementsByClassName("cellMap");
        let pos = 0;

        for (let cell of cells) {
            cell.pos = pos++;
            cell.ondragover = this.dragoverHandler;
            cell.ondrop = this.dropHandler;
        };
    }

    /*
     *
     */
    dragoverHandler(event) {
        console.log('dragoverHandler');
        if (this.classList.contains("inPath")) {
            event.preventDefault();
        }
    }

    /*
     *
     */
    dropHandler(event) {
        console.log('dropHandler');
        if (this.classList.contains("inPath")) {
            moveFrog(game.dragCell, this);
            actionFrog();
        }
    }

    /*
     *
     */
    makeTable(array) {
        let table = '';
        let posY = 0;

        table += '<tr><td id="male" class="male" colspan="' + this.mapWidth + '"></td></tr>';

        for (let y = 0; y < this.mapHeight; y++) {
            posY = y * this.mapWidth;
            table += "<tr>";
            for (let x = 0; x < this.mapWidth; x++) {
                table += `<td id=\"m${posY + x}\" class=\"cellMap b${array[posY + x].back}\"></td>`;
            }
            table += "</tr>";
        }

        return table;
    }

    /*
     *
     */
    static getCell(pos) {
        return document.getElementById("m" + pos);
    }

    /*
     *
     */
    showTile(pos, bVisible) {
        let sType;
        let cell = Map.getCell(pos);

        if (!game.memory && bVisible == false)
            return;

        this.data[pos].visible = bVisible;
        if (this.data[pos].visible) {
            if (this.data[pos].type === TYPE_MALE) {
                sType = 'type' + (this.data[pos].type) + (this.data[pos].data);
            } else {
                sType = 'type' + (this.data[pos].type);
            }
            cell.style.backgroundImage = "url('" + IMG_PATH + sType + ".png')";

        } else {
            cell.style.backgroundImage = "";
        }
    }
};
