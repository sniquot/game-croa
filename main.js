var game;

class Game {
    constructor(ply) {
        this.debug = true;
        this.turn = 0;
        this.moves = 0;
        this.kills = 0;
        this.currentCell = null;
        this.dragCell = null;
        this.lastCell = null;
        this.nenuphar = false;
        this.currentPlayer = 0;
        this.nbPlayer = 2;
        this.nbFrogs = 0;
        this.memory = false;
        this.map = {
            mapHeight: 8,
            mapWidth: 8,
            mapSize: 64,
            data: []
        };
        this.players = [];
        this.frogs = [];
    };
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
        this.males = [];
    }
};

initGame(2);

function initGame(ply) {
    game = new Game(ply);

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
    let html = makeTable(game.map.data);
    let element = document.getElementById("map");
    element.textContent = ``;
    element.insertAdjacentHTML("afterbegin", html);
    cells = initCells();
    drawFrogs(cells);
    drawMales(game.currentPlayer);
}

/*
 *
 */
function initMales() {
    for (let i = 0; i < game.nbPlayer; i++) {
        for (let x = 0; x < 6; x++) {
            game.players[i].males[x] = false;
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

    var posBx = (posBefore % game.map.mapWidth);
    var posAx = (posAfter % game.map.mapHeight);
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

    if (!game.memory && bVisible == false)
        return;

    game.map.data[cell.frog].visible = bVisible;
    if (game.map.data[cell.frog].visible) {
        if (game.map.data[cell.frog].type === 5) {
            sType = 'type' + (game.map.data[cell.frog].type) + (game.map.data[cell.frog].data);
        } else {
            sType = 'type' + (game.map.data[cell.frog].type);
        }
        cell.style.backgroundImage = "url('images/" + sType + ".png')";

    } else {
        cell.style.backgroundImage = "";
    }
}

/*
 *
 */
function lastPos(pos) {
    if (game.nenuphar) {
        if (pos == game.lastCell.frog)
            return true;
    }
    return false;
}

/*
 *
 */
function drawPath(cell, bVisible) {
    console.log('drawPath : ' + cell.frog);
    var min = cell.frog - 10;
    var max = cell.frog + 10;
    let count = 0;

    if (min < 0)
        min = 0;
    if (max > game.map.mapSize)
        max = game.map.mapSize;

    for (let i = min; i < max; i++) {
        if (checkMove(cell.frog, i)) {
            let cellDropable = document.getElementById("m" + i);
            if (cellDropable && bVisible) {
                // Ignore la case d'origine
                if (game.frogs[cell.frog] !== game.frogs[cellDropable.frog]) {
                    // Cas Nénuphar on ignore la dernière position
                    if (!lastPos(cellDropable.frog))
                        // Ignore les cases qui sont déjà occupées
                        if ((game.frogs[cellDropable.frog] == null) || (game.frogs[cellDropable.frog].player !== game.currentPlayer)) {
                            cellDropable.classList.add("inPath");
                            count++;
                        }
                }
            } else {
                cellDropable.classList.remove("inPath");
            }
        }
    }

    // Cas Nénuphar : Si pas de déplacement possible on autorise le retour en arrière.
    if (game.nenuphar && bVisible && count == 0) {
        game.dragCell.classList.add("inPath");
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
    console.log('dragoverHandler');
    if (this.classList.contains("cellMap"))
        if (!isStuck(game.frogs[game.dragCell.frog]))
            if (!isFrozen(game.frogs[game.dragCell.frog]))
                if (game.frogs[game.dragCell.frog].player == game.currentPlayer)
                    if (this.frog !== game.dragCell.frog)
                        if ((game.frogs[this.frog] == null) || (game.frogs[this.frog].player !== game.currentPlayer))
                            if (checkMove(game.dragCell.frog, this.frog))
                                event.preventDefault();
}

/*
 *
 */
function dropHandler(event) {
    console.log('dropHandler');
    if (this.classList.contains("cellMap")) {
        moveFrog(game.dragCell, this);
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
    game.players[game.currentPlayer].moves++;
    game.lastCell = beforeCell;
    game.currentCell = afterCell;

    let oldPos = beforeCell.frog;
    let newPos = afterCell.frog;
    let frog = game.frogs[beforeCell.frog];

    logFrog(frog, 'Move [' + beforeCell.frog + '] >> [' + afterCell.frog + ']');

    frog.moves++;
    frog.pos = afterCell.frog;

    if (game.frogs[newPos] != null && game.frogs[newPos].player != game.frogs[oldPos].player) {
        frog.kills++;
        killFrog(afterCell);
        logFrog(frog, 'Kill [' + game.frogs[newPos].name + ']');
    }

    game.frogs[oldPos] = null;
    removeFrog(beforeCell);
    showTile(beforeCell, false);

    game.frogs[newPos] = frog;
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
    if (game.frogs[cell.frog] !== null) {
        var pos = cell.frog;
        var img = document.createElement('img');
        var sColor = '';

        sPrefix = (game.frogs[pos].isQueen) ? 'queen_' : 'frog_';
        sColor = sPrefix + `${colors[game.frogs[pos].player]}.png`;

        img.src = 'images/' + sColor;
        img.className = 'imgFrog';
        img.draggable = true;
        img.title = game.frogs[pos].name;

        img.ondragstart = function (event) {
            console.log('ondragstart');
            game.dragCell = this.parentNode;
            let frog = game.frogs[game.dragCell.frog];
            if ((game.currentPlayer == frog.player) && (!isStuck(frog)) && !isFrozen(frog)) {
                drawPath(game.dragCell, true);
            }
        };

        img.ondragend = function (event) {
            console.log('ondragend');
            drawPath(game.dragCell, false);
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
function drawMales(ply) {
    let image = ``;

    for (let i = 0; i < 4; i++) {
        image += `<img src="./images/frog_${game.players[ply].color}.png" class="extra${game.players[ply].color}" alt="Extra ${game.players[ply].color} Frog">`;
    }

    for (let i = 0; i < 6; i++) {
        let cssclass = ``;
        if (game.players[ply].males[i]) { cssclass = `active`; }
        image += `<img src="./images/mini5${i}.png" id="${game.players[ply].color + i}" class="mini ${cssclass}" alt="">`;
    }

    let element = document.getElementById("male");
    element.innerHTML = image;
}

/*
 *
 */
function makeTable(array) {
    let table = "";
    var posY = 0;

    table += '<tr><td id="male" class="male" colspan="8"></td></tr>';

    for (let y = 0; y < game.map.mapHeight; y++) {
        posY = y * game.map.mapWidth;
        table += "<tr>";
        for (let x = 0; x < game.map.mapWidth; x++) {
            table += `<td id=\"m${posY + x}\" class=\"cellMap b${array[posY + x].back}\"></td>`;
        }
        table += "</tr>";
    }

    return table;
}
/*
 *
 */
function initPlayers(nbPly) {
    shuffleArray(colors);
    for (let i = 0; i < nbPly; i++) {
        game.players[i] = new Player;
        game.players[i].color = colors[i];
    }
}
/*
 *
 */
function initFrogs(nbPly) {
    game.nbPlayer = nbPly;

    resetFrogs();
    switch (game.nbPlayer) {
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
    frg.id = game.nbFrogs++;
    frg.pos = pos;

    game.players[ply].inGame++;

    game.frogs[pos] = frg;
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
    for (let i = 0; i < game.map.mapSize; i++) {
        game.frogs[i] = null;
    }
}

/*
 *
 */
function resetMap() {
    for (let x = 0; x < game.map.mapSize; x++) {
        game.map.data[x] = dalles[x];
    }

    shuffleArray(game.map.data);
}

/*
 *
 */
function logFrog(frog, msg) {
    if (game.debug)
        console.log('T' + game.turn + ' P' + frog.player + ' : <' + frog.name + '> ' + msg);
}

/*
 *
 */
function actionFrog(cell) {
    let type = game.map.data[cell.frog].type;
    let frog = game.frogs[cell.frog];

    switch (type) {
        case 0: // Nenuphar
            logFrog(frog, 'Nenuphar');
            game.nenuphar = true;
            freeze();
            break;
        case 1: // Mosquito
            logFrog(frog, 'Mosquito');
            game.nenuphar = false;
            if (game.players[game.currentPlayer].inGame > 1) {
                frog.mud = game.turn + 1;
                if (isAvailable(frog.player)) {
                    freeze();
                } else nextPlayer();
            } else nextPlayer();
            break;
        case 2: // Mud
            frog.mud = game.turn + (game.nbPlayer * 2);
            logFrog(frog, 'Mud >> T' + frog.mud);
            nextPlayer();
            break;
        case 3: // Pike
            logFrog(frog, 'Pike');
            if (frog.isQueen) {
                killPlayer(frog.player);
            } else {
                killFrog(cell);
            }
            nextPlayer();

            break;
        case 4: // Reed
            logFrog(frog, 'Reed');
            nextPlayer();
            break;
        case 5: // Male
            logFrog(frog, 'Male');

            if (frog.isQueen) {
                if (!game.players[game.currentPlayer].males[game.map.data[cell.frog].data]) {
                    game.players[game.currentPlayer].males[game.map.data[cell.frog].data] = true;
                    let element = document.getElementById(colors[game.currentPlayer] + game.map.data[cell.frog].data);
                    element.classList.add("active");
                    logFrog(frog, 'Birth');
                }
            }
            nextPlayer();
            break;
        case 6: // Log
            logFrog(frog, 'Log');
            nextPlayer();
            break;

        default:
            logFrog(frog, "Unknow Type : " + type);
            break;
    }

}

/*
 *
 */
function killFrog(cell) {
    frog = game.frogs[cell.frog];

    if (frog.isQueen) {
        killPlayer(frog.player);
    } else {
        game.frogs[cell.frog] = null;
        game.players[frog.player].inGame--;
        removeFrog(cell);
        showTile(cell, false);
    }
}

/*
 *
 */
function killPlayer(ply) {
    var pos = 0;
    game.frogs.forEach(frog => {
        if (frog !== null && frog.player == ply) {
            game.players[ply].inGame--;
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
    game.currentPlayer = ++game.currentPlayer % game.nbPlayer;
    game.nenuphar = false;
    freeze();
    drawMales(game.currentPlayer);
    game.turn++;
}

/*
 *
 */
function isStuck(frog) {
    if (frog.mud !== 0 && frog.mud > game.turn) {
        return true;
    }

    return false;
}

/*
 *
 */
function isFrozen(frog) {
    if (game.nenuphar && (frog.id !== game.frogs[game.currentCell.frog].id)) {
        return true;
    }
    return false;
}

/*
 *
 */
function freeze() {
    for (let index = 0; index < game.frogs.length; index++) {
        const frog = game.frogs[index];

        if (frog !== null) {
            let cell = getCell(index);
            if (cell) {
                let img = cell.querySelector("img");
                if (img) {
                    if ((frog.player !== game.currentPlayer) || isFrozen(frog) || isStuck(frog)) {
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
    for (let index = 0; index < game.frogs.length; index++) {
        const frog = game.frogs[index];
        if (frog !== null) {
            if ((frog.player == ply) && !isFrozen(frog) && !isStuck(frog)) {
                bAvailable = true;
            }
        }
    }
    return bAvailable;
}
