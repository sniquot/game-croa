var game;

/*
 *
 */
class Game {
    constructor(ply) {
        this.debug = true;
        this.turn = 0;
        this.moves = 0;
        this.kills = 0;
        this.currentCell = null;
        this.dragCell = null;
        this.dragData = '';
        this.lastCell = null;
        this.nenuphar = false;
        this.currentPlayer = 0;
        this.nbPlayer = ply;
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

/*
 *
 */
class Frog {
    constructor() {
        this.player = 0;
        this.moves = 0;
        this.kills = 0;
        this.isQueen = false;
        this.baby = null;
        this.mud = 0;
        this.pos = 0;
        this.name = '';
    }
};

/*
 *
 */
class Player {
    constructor() {
        this.frogs = 4;
        this.inGame = 0;
        this.moves = 0;
        this.birth = null;
        this.color = ``;
        this.kills = 0;
        this.males = [];
    }
};

initGame(2);

/*
 *
 */
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
    let diff = Math.abs(posAfter - posBefore);
    let bMove = (move.indexOf(diff) >= 0) ? true : false;
    if (!bMove) {
        return false;
    }

    let posBx = (posBefore % game.map.mapWidth);
    let posAx = (posAfter % game.map.mapHeight);
    let diffx = Math.abs(posBx - posAx);
    if (diffx > 1)
        return false;

    return true;
}

/*
 *
 */
function showTile(cell, bVisible) {
    let sType;

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
    //console.log('drawPath : ' + cell.frog);

    let frog = game.frogs[cell.frog];
    if (bVisible && (game.currentPlayer !== frog.player || hasBorn(frog) || isStuck(frog))) {
        return;
    }

    let min = cell.frog - 10;
    let max = cell.frog + 10;
    let count = 0;

    if (min < 0)
        min = 0;
    if (max > game.map.mapSize)
        max = game.map.mapSize;

    for (let i = min; i < max; i++) {
        let cellDropable = document.getElementById("m" + i);
        if (bVisible) {
            if (checkMove(cell.frog, i)) {
                // Cas Nénuphar on ignore la dernière position
                if (!lastPos(cellDropable.frog))
                    // Juste les cases vides ou les joueurs adverses
                    if ((game.frogs[cellDropable.frog] == null) || (game.frogs[cellDropable.frog].player !== game.currentPlayer)) {
                        cellDropable.classList.add("inPath");
                        count++;
                    }
            }
        } else {
            cellDropable.classList.remove("inPath");
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
    //console.log('dragoverHandler');
    let frog = game.frogs[game.dragCell.frog];
    if (this.classList.contains("cellMap"))
        if (!isStuck(frog))
            if (!isFrozen(frog))
                if (!hasBorn(frog))
                    if (frog.player == game.currentPlayer)
                        if (this.frog !== game.dragCell.frog)
                            if ((game.frogs[this.frog] == null) || (game.frogs[this.frog].player !== game.currentPlayer))
                                if (checkMove(game.dragCell.frog, this.frog))
                                    event.preventDefault();
}

/*
 *
 */
function dropHandler(event) {
    //console.log('dropHandler');
    if (this.classList.contains("cellMap")) {
        game.dragData = event.dataTransfer.getData("Text");
        moveFrog(game.dragCell, this);
        actionFrog(this);
    }
}

/*
 *
 */
function drawFrogs() {
    for (let i = 0; i < game.frogs.length; i++) {
        let frog = game.frogs[i];
        removeFrog(frog);
        drawFrog(frog);
    }
}

/*
 *
 */
function kill(frog) {
    if (frog.isQueen) {
        killPlayer(frog.player);
        console.log('Player <' + game.players[game.currentPlayer].color + '> is dead!');
    }
    else {
        logFrog(frog, 'is dead!');
        killFrog(frog);
    }
};
/*
 *
 */
function moveFrog(beforeCell, afterCell) {
    game.players[game.currentPlayer].moves++;
    game.lastCell = beforeCell;
    game.currentCell = afterCell;

    let oldPos = beforeCell.frog;
    let newPos = afterCell.frog;

    let frog = game.frogs[oldPos];
    let frogB = game.frogs[newPos];


    logFrog(frog, 'Move [' + oldPos + '] >> [' + newPos + ']');

    let baby = false;
    if (frog.isQueen && frog.baby != null) {
        baby = true;
        game.players[frog.player].birth = null;
        let tmp = frog.baby;
        if (game.dragData == frog.baby.id) {
            game.frogs[oldPos] = frog;
            game.frogs[oldPos].baby = null;
            frog = tmp;

        }
        else {
            game.frogs[oldPos] = tmp;
            frog.baby = null;
        }
    }

    if (frogB != null && frogB.player != frog.player) {
        frog.kills++;
        logFrog(frog, 'Kill <' + frogB.name + '>');
        kill(frogB);
    }

    removeFrog(frog);
    if (!baby) {
        game.frogs[oldPos] = null;
        showTile(beforeCell, false);
    }

    frog.moves++;
    frog.pos = newPos;

    game.frogs[newPos] = frog;
    showTile(afterCell, true);
    drawFrog(frog);

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
function getCell(pos) {
    return document.getElementById("m" + pos);
}

/*
 *
 */
function drawFrog(frog) {
    if (frog !== null) {
        let img = document.createElement('img');
        let sColor = '';

        sPrefix = (frog.isQueen) ? 'queen_' : 'frog_';
        sColor = sPrefix + `${colors[frog.player]}.png`;

        img.src = 'images/' + sColor;
        img.className = 'imgFrog';
        img.draggable = true;
        img.title = frog.name;
        img.id = frog.id;

        img.ondragstart = function (event) {
            //console.log('ondragstart');
            event.dataTransfer.setData("Text", event.target.id);
            game.dragCell = this.parentNode;
            drawPath(game.dragCell, true);
        };

        img.ondragend = function (event) {
            //console.log('ondragend');
            drawPath(game.dragCell, false);
        };

        getCell(frog.pos).appendChild(img);
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

    for (let i = 0; i < game.players[ply].frogs; i++) {
        image += `<img src="./images/frog_${game.players[ply].color}.png" class="extra${game.players[ply].color}" alt="Extra ${game.players[ply].color} Frog">`;
    }

    for (let i = 0; i < 6; i++) {
        let cssclass = ``;
        if (game.players[ply].males[i]) { cssclass = `active`; }
        image += `<img src="./images/mini5${i}.png" id="${game.players[ply].color + i}" class="mini ${cssclass}" alt="Male ${game.players[ply].color} ${cssclass}">`;
    }

    let element = document.getElementById("male");
    element.innerHTML = image;
}

/*
 *
 */
function makeTable(array) {
    let table = '';
    let posY = 0;

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
    frg.id = 'frog' + game.nbFrogs++;
    frg.pos = pos;

    game.players[frg.player].inGame++;

    return frg;
}

/*
 *
 */
function initFrog(pos, ply) {
    for (let i = 0; i < 3; i++) {
        let frog = newFrog(playerConfig[pos][i][0], ply, playerConfig[pos][i][1]);
        game.frogs[frog.pos] = frog;
    }
}


/*
 * Retourne le nom d'une grenouille
 * L'élément retourné est retiré de la liste, pour éviter les doublons
 */
function getName() {
    let index = Math.floor(Math.random() * names.length);
    let name = names[index];
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
        console.log('T' + game.turn + ' P' + frog.player + ' : ' + (frog.isQueen ? 'Queen ' : '') + '<' + frog.name + '> ' + msg);
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
            logFrog(frog, 'Mosquito' + mosquitoEmoji);
            game.nenuphar = false;
            if (game.players[frog.player].inGame > 1) {
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
            logFrog(frog, 'Pike eat <' + frog.name + '>!');
            kill(frog);
            nextPlayer();

            break;
        case 4: // Reed
            logFrog(frog, 'Reed');
            nextPlayer();
            break;
        case 5: // Male
            logFrog(frog, 'Male');

            if (frog.isQueen) {
                // Male déjà activé ?
                if (!game.players[game.currentPlayer].males[game.map.data[cell.frog].data]) {
                    // Grenouilles en réserve ?
                    if (game.players[game.currentPlayer].frogs > 0) {
                        game.players[game.currentPlayer].males[game.map.data[cell.frog].data] = true;
                        let element = document.getElementById(colors[game.currentPlayer] + game.map.data[cell.frog].data);
                        element.classList.add("active");
                        let birth = newFrog(frog.pos, frog.player, false);
                        frog.baby = birth;
                        game.players[frog.player].birth = frog.pos;
                        game.players[frog.player].frogs--;
                        logFrog(birth, 'was born!' + heart2Emoji);
                        drawFrog(birth);
                    }
                    else
                        logFrog(frog, 'no more frogs available!');
                } else
                    logFrog(frog, 'have already sex with this male!');
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
function killFrog(frog) {
    let cell = getCell(frog.pos);

    game.frogs[frog.pos] = null;
    game.players[frog.player].inGame--;
    game.players[frog.player].frogs++;

    removeFrog(frog);
    showTile(cell, false);
}

/*
 *
 */
function killPlayer(ply) {
    game.frogs.forEach(frog => {
        if (frog !== null && frog.player == ply) {
            killFrog(frog);
        }
    });
}

/*
 *
 */
function isAlive() {
    let alive = 0;
    let playerAlive = 0;

    for (let index = 0; index < game.players.length; index++) {
        if (game.players[index].inGame > 0) {
            alive++;
            playerAlive = index;
        }
    }

    if (alive > 1)
        return true;

    game.currentPlayer = playerAlive;
    return false;
}

/*
 *
 */
function nextPlayer() {
    if (!isAlive()) {
        console.log('Game finish, player <' + game.players[game.currentPlayer].color + '> win!' + trophyEmoji);
    } else {
        game.turn++;
        game.nenuphar = false;

        // Ignore les joueurs morts.
        do {
            game.currentPlayer = ++game.currentPlayer % game.nbPlayer;
        } while (game.players[game.currentPlayer].inGame == 0);

        freeze();
        drawMales(game.currentPlayer);
    }
}

/*
 *
 */
function hasBorn(frog) {
    if (frog.player == game.currentPlayer && !frog.isQueen && game.players[frog.player].birth !== null) {
        return true;
    }
    return false;
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
            let img = document.getElementById(frog.id);
            if (img) {
                if ((frog.player !== game.currentPlayer) || isFrozen(frog) || isStuck(frog) || hasBorn(frog)) {
                    img.classList.add("frozen");
                } else {
                    img.classList.remove("frozen");
                }
            }
        }
    }

    game.players.forEach((player, index) => {
        if (player.birth !== null) {
            let queen = game.frogs[player.birth];
            if (queen !== null && queen.baby !== null) {
                let img = document.getElementById(queen.baby.id);
                if (img)
                    if (game.currentPlayer != index) img.classList.add("frozen");
                    else img.classList.remove("frozen");
            }
        }
    });

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
