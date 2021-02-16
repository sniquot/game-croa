const frogs = [];

var Game = {
    turn: 0,
    moves: 0,
    kills: 0,
    currentCell: null,
    currentPlayer: 0,
    nbPlayer: 2,
    map: {
        mapHeight: 8,
        mapWidth: 8,
        mapSize: this.mapHeight * this.mapWidth,
        data: []
    },
    players: []
};

class Frog {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.player = 0;
        this.moves = 0;
        this.kills = 0;
        this.isQueen = false;
        this.isMud = false
    }
};

class Player {
    constructor() {
        this.frogs = 4;
        this.moves = 0;
        this.color = ``;
        this.kills = 0;
        this.frogs = [];
        this.males = [];
    }
};

initGame(Game.nbPlayer);

function initGame(ply) {
    
    Game.nbPlayer = ply;
    Game.turn = 0;
    Game.moves = 0;
    Game.kills = 0;
    Game.currentCell = null;
    Game.currentPlayer = 0;

    shuffleArray(colors);

    initPlayers(ply);
    initFrogs(ply);
    initMales();
    initMap();
}

/*
 *
 */
function initMap() {
    resetMap();
    drawMap();
}

/*
 *
 */
function drawMap() {
    let html = makeTable(Game.map.data);
    let element = document.getElementById("map");
    element.textContent = ``;
    element.insertAdjacentHTML("afterbegin", html);
    cells = initCells();
    drawFrogs(cells);
}

/*
 *
 */
function initMales() {
    for (let i = 0; i < Game.nbPlayer; i++) {
        //males[i] = [];
        for (let x = 0; x < 6; x++) {
            Game.players[i].males[x] = false;
            //males[i][x] = false;
        }
    }
}

/*
 *
 */
function checkMove(posBefore, posAfter) {
    const move = [9, 8, 7, 1];
    var diff = Math.abs(posAfter - posBefore);
    var bMove = (move.indexOf(diff) >= 0) ? true : false;
    if (!bMove) {
        return false;
    }

    var posBx = (posBefore % Game.map.mapWidth);
    var posAx = (posAfter % Game.map.mapHeight);
    var diffx = Math.abs(posBx - posAx);
    if (diffx > 1)
        return false;

    return true;
}

/*
 *
 */
function showTile(cell) {
    var sType;
    if (Game.map.data[cell.frog].visible) {
        if (Game.map.data[cell.frog].type === 5) {
            sType = 'type' + (Game.map.data[cell.frog].type) + (Game.map.data[cell.frog].data)
        } else {
            sType = 'type' + (Game.map.data[cell.frog].type)
        }
        cell.style.backgroundImage = "url('images/" + sType + ".png')";

    } else {
        cell.style.backgroundImage = "";
    }
}

/*
 *
 */
function drawPath(cell, bVisible) {
    var min = cell.frog - 10;
    var max = cell.frog + 10;

    if (min < 0)
        min = 0;
    if (max > Game.map.mapSize)
        max = Game.map.mapSize;

    for (let i = min; i < max; i++) {
        if (checkMove(cell.frog, i)) {
            let cellDropable = document.getElementById("m" + i);
            if (bVisible) {
                // Ignore la case d'origine
                if (frogs[cell.frog] !== frogs[cellDropable.frog]) {
                    // Ignore les cases qui sont déjà occupées
                    if (frogs[cellDropable.frog] == null)
                        cellDropable.classList.add("inPath");
                }
            } else {
                cellDropable.classList.remove("inPath");
            }
        }
    }
}

/*
 *
 */
function initCells() {
    let cells = document.getElementsByClassName("cellMap");

    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];
        cell.frog = i;

        cell.ondragover = dragoverHandler;
        cell.ondrop = dropHandler;
    }
    return cells;
}

/*
 *
 */
function dragoverHandler(event) {
    if (this.classList.contains("cellMap"))
        if (frogs[Game.currentCell.frog].player == Game.currentPlayer)
            if (this.frog !== Game.currentCell.frog)
                //if (frogs[this.frog] !== frogs[currentCell.frog])
                if (frogs[this.frog] == null)
                    if (checkMove(Game.currentCell.frog, this.frog))
                        event.preventDefault();
}

/*
 *
 */
function dropHandler(event) {
    if (this.classList.contains("cellMap")) {
        moveFrog(Game.currentCell, this);
        actionFrog(this);
    }
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
function moveFrog(beforeCell, afterCell) {
    Game.players[Game.currentPlayer].moves++;

    deleteFrog(beforeCell);
    frogs[afterCell.frog] = frogs[beforeCell.frog];
    frogs[beforeCell.frog] = null;
    Game.map.data[beforeCell.frog].visible = false;
    showTile(beforeCell);

    addFrog(afterCell);
    Game.map.data[afterCell.frog].visible = true;
    showTile(afterCell);
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
    if (frogs[cell.frog] !== null) {
        var img = document.createElement('img');
        var sColor = '';

        sPrefix = (frogs[cell.frog].isQueen) ? 'queen_' : 'frog_';
        sColor = sPrefix + `${colors[frogs[cell.frog].player]}.png`;
        console.log(sColor);

        img.src = 'images/' + sColor;
        img.className = 'imgFrog';
        img.draggable = true;
        img.frog = cell.frog;

        img.ondragstart = function (event) {
            console.log('start:' + this.frog);

            //Game.currentPlayer = frogs[this.frog].player;
            if (Game.currentPlayer == frogs[this.frog].player) {
                Game.currentCell = this.parentNode;
                drawPath(Game.currentCell, true);
            }

        };

        img.ondragend = function (event) {
            drawPath(Game.currentCell, false);
        };

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
function drawMale(ply) {
    let image = ``;
    let cssclass = ``;

    for (let i = 0; i < 4; i++) {
        image += `<img src="./images/frog_${Game.players[ply].color}.png" class="extra${Game.players[ply].color}" alt="">`;
    }

    for (let i = 0; i < 6; i++) {
        if (Game.players[ply].males[i]) { cssclass = `active`; }
        image += `<img src="./images/mini5${i}.png" id="${Game.players[ply].color + i}" class="mini ${cssclass}" alt="">`;
    }

    return image;
}

/*
 *
 */
function makeTable(array) {
    let table = "";
    var posY = 0;

    table += '<tr><td class="corner"></td><td id="four" class="four" colspan="8">' + ((Game.nbPlayer == 4) ? drawMale(3) : '') + '</td><td class="corner"></td></tr>';

    for (let y = 0; y < Game.map.mapHeight; y++) {
        posY = y * 8;
        table += "<tr>";
        if (y == 0) { table += `<td id="one" class="one" rowspan="${Game.map.mapHeight}">` + drawMale(0) + `</td>`; }
        for (let x = 0; x < Game.map.mapWidth; x++) {
            table += `<td id=\"m${posY + x}\" class=\"cellMap b${array[posY + x].back}\"></td>`;
        }
        if (y == 0) { table += `<td id="three" class="three" rowspan="${Game.map.mapHeight}">` + ((Game.nbPlayer == 2) ? drawMale(1) : drawMale(2)) + `</td>`; }
        table += "</tr>";
    }

    table += '<tr><td class="corner"></td><td id="two" class="two" colspan="8">' + ((Game.nbPlayer == 3 || Game.nbPlayer == 4) ? drawMale(1) : '') + '</td><td class="corner"></td></tr>';

    return table;
}
/*
 *
 */
function initPlayers(nbPly) {
    for (let i = 0; i < nbPly; i++) {
        Game.players[i] = new Player;
        Game.players[i].color = colors[i];
    }
}
/*
 *
 */
function initFrogs(nbPly) {
    Game.nbPlayer = nbPly;

    resetFrogs();
    switch (Game.nbPlayer) {
        case 3:
            initFrog('topLeft', 0);
            initFrog('botLeft', 1);
            initFrog('midRight', 2);
            break;
        case 4:
            initFrog('topLeft', 0);
            initFrog('topRight', 3);
            initFrog('botLeft', 1);
            initFrog('botRight', 2);
            break;
        default:
            initFrog('topLeft', 0);
            initFrog('botRight', 1);
    }
}

/*
 *
 */
function initFrog(pos, ply) {
    for (let i = 0; i < 3; i++) {
        let frg = new Frog;

        frg.x = playerConfig[pos][i][0] % Game.map.mapWidth;
        frg.y = Math.trunc(playerConfig[pos][i][0] / Game.map.mapHeight);
        frg.player = ply;
        frg.isQueen = (playerConfig[pos][i][1] == 1) ? true : false;

        setFrog(frg);
    }
}

/*
 *
 */
function setFrog(frg) {
    if (frg.x >= 0 && frg.x < Game.map.mapWidth && frg.y >= 0 && frg.y <= Game.map.mapHeight) {
        frogs[(frg.y * Game.map.mapHeight + frg.x)] = frg;
    }

}

/*
 *
 */
function resetFrogs() {
    for (let y = 0; y < Game.map.mapHeight; y++) {
        for (let x = 0; x < Game.map.mapWidth; x++) {
            frogs[(y * Game.map.mapHeight + x)] = null;
        }
    }
}

/*
 *
 */
function resetMap() {
    let i = 0;
    for (let y = 0; y < Game.map.mapHeight; y++) {
        for (let x = 0; x < Game.map.mapWidth; x++) {
            Game.map.data[(y * Game.map.mapHeight + x)] = dalles[i++];
        }
    }
    shuffleArray(Game.map.data);
}

/*
 *
 */
function actionFrog(cell) {
    let type = Game.map.data[cell.frog].type;
    Game.turn++;

    switch (type) {
        case 0: // Nenuphar
            break;
        case 1: // Mosquito
            break;
        case 2: // Mud
            break;
        case 3: // Pike
            deleteFrog(cell);
            Game.players[Game.currentPlayer].frogs--;
            //map[cell.frog].visible = false;
            //showTile(cell);
            break;
        case 4: // Reed
            break;
        case 5: // Male
            // (!males[Game.currentPlayer][Game.map.data[cell.frog].data])

            if (!Game.players[Game.currentPlayer].males[Game.map.data[cell.frog].data]) {
                Game.players[Game.currentPlayer].males[Game.map.data[cell.frog].data] = true;
                let element = document.getElementById(colors[Game.currentPlayer] + Game.map.data[cell.frog].data);
                element.classList.add("active");
                addFrog(cell);
            }
            break;
        case 6: // Log
            break;

        default:
            break;
    }

    nextPlayer();

}

/*
 *
 */

function nextPlayer() {
    Game.currentPlayer = ++Game.currentPlayer % Game.nbPlayer;
}