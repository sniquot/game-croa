
const frogs = [];

/*
 
class Game {
    constructor(ply) {
        this.turn = 0,
            this.moves = 0,
            this.kills = 0,
            this.currentCell = null,
            this.currentPlayer = 0,
            this.nbPlayer = ply,
            this.map = {
                mapHeight: 8,
                mapWidth: 8,
                mapSize: this.mapHeight * this.mapWidth,
                data: []
            },
            this.players = []
    }
};
 
 */
var game;

var Game = {
    turn: 0,
    moves: 0,
    kills: 0,
    currentCell: null,
    lastCell: null,
    nenuphar: false,
    currentPlayer: 0,
    nbPlayer: 2,
    nbFrogs: 0,
    memory: false,
    map: {
        mapHeight: 8,
        mapWidth: 8,
        mapSize: 64,
        data: []
    },
    players: []
};

class Frog {
    constructor() {
        this.player = 0;
        this.moves = 0;
        this.kills = 0;
        this.isQueen = false;
        this.mud = 0;
        this.pos = 0;
        this.name = '';
    }
};

class Player {
    constructor() {
        this.frogs = 4;
        this.inGame = 0;
        this.moves = 0;
        this.color = ``;
        this.kills = 0;
        //this.frogs = [];
        this.males = [];
    }
};

initGame(Game.nbPlayer);

function initGame(ply) {
    Game.nbPlayer = ply;
    Game.turn = 0;
    Game.moves = 0;
    Game.kills = 0;
    Game.lastCell = null;
    Game.currentCell = null;
    Game.currentPlayer = 0;
    Game.nenuphar = false;
    Game.memory = false;
    Game.nbFrogs = 0;

    initPlayers(ply);
    initFrogs(ply);
    initMales();
    initMap();

    freeze();
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
        for (let x = 0; x < 6; x++) {
            Game.players[i].males[x] = false;
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
function showTile(cell, bVisible) {
    var sType;

    if (!Game.memory && bVisible == false)
        return;

    Game.map.data[cell.frog].visible = bVisible;
    if (Game.map.data[cell.frog].visible) {
        if (Game.map.data[cell.frog].type === 5) {
            sType = 'type' + (Game.map.data[cell.frog].type) + (Game.map.data[cell.frog].data);
        } else {
            sType = 'type' + (Game.map.data[cell.frog].type);
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
                    if ((frogs[cellDropable.frog] == null) || (frogs[cellDropable.frog].player !== Game.currentPlayer))
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
        if (!isStuck(frogs[Game.lastCell.frog]))
            if (!isFrozen(frogs[Game.lastCell.frog]))
                if (frogs[Game.lastCell.frog].player == Game.currentPlayer)
                    if (this.frog !== Game.lastCell.frog)
                        if ((frogs[this.frog] == null) || (frogs[this.frog].player !== Game.currentPlayer))
                            if (checkMove(Game.lastCell.frog, this.frog))
                                event.preventDefault();
}

/*
 *
 */
function dropHandler(event) {
    if (this.classList.contains("cellMap")) {
        moveFrog(Game.lastCell, this);
        actionFrog(this);
    }
}

/*
 *
 */
function drawFrogs(cells) {
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];

        removeFrog(cell);
        drawFrog(cell);
    }
}

/*
 *
 */
function moveFrog(beforeCell, afterCell) {
    Game.players[Game.currentPlayer].moves++;
    Game.lastCell = beforeCell;
    Game.currentCell = afterCell;

    let oldPos = beforeCell.frog;
    let newPos = afterCell.frog;
    let frog = frogs[beforeCell.frog];

    frog.moves++;
    frog.pos = afterCell.frog;

    if (frogs[newPos] != null && frogs[newPos].player != frogs[oldPos].player) {
        frog.kills++;
        killFrog(afterCell);
    }

    frogs[oldPos] = null;
    removeFrog(beforeCell);
    showTile(beforeCell, false);

    frogs[newPos] = frog;
    showTile(afterCell, true);
    drawFrog(afterCell);

}

/*
 *
 */
function removeFrog(cell) {
    var element = cell.querySelector("img");
    if (element)
        cell.removeChild(element);
}

/*
 *
 */
function getCell(pos) {
    return document.getElementById("m" + pos);
}

/*
 *
 */
function drawFrog(cell) {
    if (frogs[cell.frog] !== null) {
        var pos = cell.frog;
        var img = document.createElement('img');
        var sColor = '';

        sPrefix = (frogs[pos].isQueen) ? 'queen_' : 'frog_';
        sColor = sPrefix + `${colors[frogs[pos].player]}.png`;

        img.src = 'images/' + sColor;
        img.className = 'imgFrog';
        img.draggable = true;
        img.title = frogs[pos].name;

        img.ondragstart = function (event) {
            Game.lastCell = this.parentNode;
            let frog = frogs[Game.lastCell.frog];
            if ((Game.currentPlayer == frog.player) && (!isStuck(frog)) && !isFrozen(frog)) {
                drawPath(Game.lastCell, true);
            }
        };

        img.ondragend = function (event) {
            drawPath(Game.lastCell, false);
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
        image += `<img src="./images/frog_${Game.players[ply].color}.png" class="extra${Game.players[ply].color}" alt="Extra ${Game.players[ply].color} Frog">`;
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
    console.log(array);
    table += '<tr><td class="corner"></td><td id="four" class="four" colspan="8">' + ((Game.nbPlayer == 4) ? drawMale(3) : '') + '</td><td class="corner"></td></tr>';

    for (let y = 0; y < Game.map.mapHeight; y++) {
        posY = y * Game.map.mapWidth;
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
    shuffleArray(colors);
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
            initFrog('botLeft', 1);
            initFrog('botRight', 2);
            initFrog('topRight', 3);
            break;
        default:
            initFrog('topLeft', 0);
            initFrog('botRight', 1);
    }
}
/*
 *
 */
function newFrog(pos, ply, isQueen) {
    let frg = new Frog;

    frg.player = ply;
    frg.name = getName();
    frg.isQueen = isQueen;
    frg.id = Game.nbFrogs++;
    frg.pos = pos;

    Game.players[ply].inGame++;

    frogs[pos] = frg;
}
/*
 *
 */
function initFrog(pos, ply) {
    for (let i = 0; i < 3; i++) {
        newFrog(playerConfig[pos][i][0], ply, playerConfig[pos][i][1]);
    }
}


/*
 * Retourne le nom d'une grenouille
 * L'élément retourné est retiré de la liste, pour éviter les doublons
 */
function getName() {
    var index = Math.floor(Math.random() * names.length);
    var name = names[index];
    names.splice(index, 1);

    return name;
}


/*
 *
 */
function resetFrogs() {
    for (let i = 0; i < Game.map.mapSize; i++) {
        frogs[i] = null;
    }
}

/*
 *
 */
function resetMap() {
    for (let x = 0; x < Game.map.mapSize; x++) {
        Game.map.data[x] = dalles[x];
    }

    shuffleArray(Game.map.data);
}

/*
 *
 */
function actionFrog(cell) {
    let type = Game.map.data[cell.frog].type;
    let frog = frogs[cell.frog];

    switch (type) {
        case 0: // Nenuphar
            Game.nenuphar = true;
            freeze();
            break;
        case 1: // Mosquito
            if (Game.players[Game.currentPlayer].inGame > 1) {
                frog.mud = Game.turn + 1;
                if (isAvailable(frog.player)) {
                    freeze();
                } else nextPlayer();
            } else nextPlayer();
            break;
        case 2: // Mud
            frog.mud = Game.turn + (Game.nbPlayer * 2);
            nextPlayer();
            break;
        case 3: // Pike
            if (frog.isQueen) {
                killPlayer(frog.player);
            } else {
                killFrog(cell);

            }
            nextPlayer();

            break;
        case 4: // Reed
            nextPlayer();
            break;
        case 5: // Male

            // (!males[Game.currentPlayer][Game.map.data[cell.frog].data])
            if (frog.isQueen) {
                if (!Game.players[Game.currentPlayer].males[Game.map.data[cell.frog].data]) {
                    Game.players[Game.currentPlayer].males[Game.map.data[cell.frog].data] = true;
                    let element = document.getElementById(colors[Game.currentPlayer] + Game.map.data[cell.frog].data);
                    element.classList.add("active");

                    //drawFrog(cell);
                }
            }
            nextPlayer();
            break;
        case 6: // Log
            nextPlayer();
            break;

        default:
            console.log("Unknow Type : " + type);
            break;
    }

}

/*
 *
 */
function killFrog(cell) {
    frog = frogs[cell.frog];

    if (frog.isQueen) {
        killPlayer(frog.player);
    } else {
        frogs[cell.frog] = null;
        Game.players[frog.player].inGame--;
        removeFrog(cell);
        showTile(cell, false);
    }
}

/*
 *
 */
function killPlayer(ply) {
    var pos = 0;
    frogs.forEach(frog => {
        if (frog !== null && frog.player == ply) {
            Game.players[ply].inGame--;
            frog = null;
            removeFrog(getCell(pos));
        }
        pos++;
    });
}

/*
 *
 */
function nextPlayer() {
    Game.currentPlayer = ++Game.currentPlayer % Game.nbPlayer;
    Game.nenuphar = false;
    freeze();
    Game.turn++;
}

/*
 *
 */
function isStuck(frog) {
    console.log(frog.mud + ' : ' + Game.turn);
    if (frog.mud !== 0 && frog.mud > Game.turn) {
        return true;
    }

    return false;
}

/*
 *
 */
function isFrozen(frog) {
    if (Game.nenuphar && (frog.id !== frogs[Game.currentCell.frog].id)) {
        return true;
    }
    return false;
}

/*
 *
 */
function freeze() {
    for (let index = 0; index < frogs.length; index++) {
        const frog = frogs[index];

        if (frog !== null) {
            let cell = getCell(index);
            if (cell) {
                let img = cell.querySelector("img");
                if (img) {
                    if ((frog.player !== Game.currentPlayer) || isFrozen(frog) || isStuck(frog)) {
                        img.classList.add("frozen");
                    } else {
                        img.classList.remove("frozen");
                    }
                }
            }
        }
    }
}

/*
 *
 */
function isAvailable(ply) {
    let bAvailable = false;
    for (let index = 0; index < frogs.length; index++) {
        const frog = frogs[index];
        if (frog !== null) {
            if ((frog.player == ply) && !isFrozen(frog) && !isStuck(frog)) {
                bAvailable = true;
            }
        }
    }
    return bAvailable;
}
