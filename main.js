const mapHeight = 8;
const mapWidth = 8;
const mapSize = mapHeight * mapWidth;

const map = [];
const frogs = [];

let currentCell = null;

let html;

resetMap();

html = makeTable(map);
let element = document.getElementById("map");
element.insertAdjacentHTML("afterbegin", html);

cells = initCells();

initPlayers(2);
drawFrogs(cells);


/*
 *
 */
function checkMove(posBefore, posAfter) {
    const move = [9, 8, 7, 1];
    var diff = Math.abs(posAfter - posBefore);

    return (move.indexOf(diff) >= 0) ? true : false;
}
/*
 *
 */
function showTile(cell) {

    if (map[cell.frog].visible) {
        cell.style.backgroundImage = "url('images/type" + (map[cell.frog].type) + ".png')";
    } else {
        cell.style.backgroundImage = "";
    }
}
/*
 *
 */
function drawPath(cell, bVisible) {
    for (let i = 0; i < mapSize; i++) {
        if (checkMove(cell.frog, i)){
			let  cellDropable = document.getElementById("m" + i);
			if (frogs[cell.frog] != frogs[cellDropable.frog]){
				if ()
				cellDropable.style.border = "3px dotted red";
			}
		}
	}
}
/*
 *
 */
function initCells() {
    let table = document.getElementsByTagName("table")[0];
    let cells = table.getElementsByTagName("td");

    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];
        cell.frog = i;

        cell.ondragenter = function(event) {
            console.log('this.frog:' + this.frog);
            console.log('currentCell:' + currentCell.frog);
            if (event.target.classList.contains("cellMap"))
                if (this.frog != currentCell.frog)
                    if (frogs[this.frog] != frogs[currentCell.frog])
                        if (checkMove(currentCell.frog, this.frog))
                            event.target.style.border = "3px solid red";

        }
        cell.ondragleave = function(event) {
            if (event.target.classList.contains("cellMap")) {
                event.target.style.border = "";
            }
        }
        cell.ondragover = function(event) {
            if (event.target.classList.contains("cellMap"))
                if (this.frog != currentCell.frog)
                    if (frogs[this.frog] != frogs[currentCell.frog])
                        if (checkMove(currentCell.frog, this.frog))
                            event.preventDefault();
        }
        cell.ondrop = function(event) {
            if (event.target.classList.contains("cellMap")) {
                event.target.style.border = "";
                frogs[this.frog] = frogs[currentCell.frog];
                frogs[currentCell.frog] = 0;
                deleteFrog(currentCell);
                addFrog(event.target);
                map[currentCell.frog].visible = false;
                map[this.frog].visible = true;
                showTile(event.target);
                showTile(currentCell);


            }
        }
    }
    return cells;
}

/*
 *
 */
function drawFrogs(cells) {
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];

        deleteFrog(cell);
        addFrog(cell);
    }
}
/*
 *
 */
function deleteFrog(cell) {
    var element = cell.querySelector("img");
    if (element)
        cell.removeChild(element);
}
/*
 *
 */
function addFrog(cell) {
    if (frogs[cell.frog] != 0) {
        var img = document.createElement('img');
        var sColor = '';

        switch (frogs[cell.frog]) {
            case 1:
                sColor = 'frog_blue.png';
                break;
            case 2:
                sColor = 'frog_pink.png';
                break;
            case 3:
                sColor = 'frog_red.png';
                break;
            case 4:
                sColor = 'frog_green.png';
                break;
        }

        img.src = 'images/' + sColor;
        img.className = 'imgFrog';
        img.draggable = true;
        img.frog = cell.frog;

        img.ondragstart = function(event) {
            console.log('start:' + this.frog);
            currentCell = this.parentNode;
			drawPath(currentCell, true);
        }

        img.ondragend = function(event) {
			drawPath(currentCell, false);
        }
		
        cell.appendChild(img);
    }
}

/*
 *
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/*
 *
 */
function makeTable(array) {
    let table = "";
    var posY = 0;

    for (let y = 0; y < mapHeight; y++) {
        posY = y * 8;
        table += "<tr>";
        for (let x = 0; x < mapWidth; x++) {
            table += `<td id=\"m${posY + x}\" class=\"cellMap b${array[posY + x].back}\"></td>`;
        }
        table += "</tr>";
    }
    return table;
}

/*
 *
 */
function initPlayers(nbPlayer) {
    console.log("Players : " + nbPlayer);
    resetPlayers();

    switch (nbPlayer) {
        case 2:
            // Top Left corner
            setFrog(0, 0, 1);
            setFrog(0, 1, 1);
            setFrog(1, 0, 1);

            // Bottom Right corner
            setFrog(7, 7, 2);
            setFrog(6, 7, 2);
            setFrog(7, 6, 2);

            break;
        case 3:
            // Top Left corner
            setFrog(0, 0, 1);
            setFrog(0, 1, 1);
            setFrog(1, 0, 1);

            // Bottom Left corner
            setFrog(0, 6, 2);
            setFrog(0, 7, 2);
            setFrog(1, 7, 2);

            // Middle Right
            setFrog(6, 3, 3);
            setFrog(7, 4, 3);
            setFrog(6, 5, 3);

            break;
        case 4:
            // Top Left corner
            setFrog(0, 0, 1);
            setFrog(0, 1, 1);
            setFrog(1, 0, 1);

            // Top Right corner
            setFrog(6, 0, 4);
            setFrog(7, 0, 4);
            setFrog(7, 1, 4);

            // Bottom Left corner
            setFrog(0, 6, 2);
            setFrog(0, 7, 2);
            setFrog(1, 7, 2);

            // Bottom Right corner
            setFrog(7, 7, 3);
            setFrog(6, 7, 3);
            setFrog(7, 6, 3);
            break;

    }
    drawFrogs(cells);
}
/*
 *
 */
function setMap(x, y, value) {
    if (x >= 0 && x < mapWidth && y >= 0 && y <= mapHeight) {
        map[(y * mapHeight + x)] = value;
    }

}
/*
 *
 */
function setFrog(x, y, value) {
    if (x >= 0 && x < mapWidth && y >= 0 && y <= mapHeight) {
        frogs[(y * mapHeight + x)] = value;
    }

}
/*
 *
 */
function resetPlayers() {
    for (y = 0; y < mapHeight; y++) {
        for (x = 0; x < mapWidth; x++) {
            setFrog(x, y, 0);
        }
    }
}
/*
 *
 */
function resetMap() {
    i = 0;
    for (y = 0; y < mapHeight; y++) {
        for (x = 0; x < mapWidth; x++) {
            setMap(x, y, dalles[i++]);
        }
    }
    shuffleArray(map);
}