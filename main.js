"use strict";

var game;

/*
 *
 */
class Game {
    constructor(ply) {
        this.debug = true;
        this.turn = 0;
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
        this.stats = {
            games: 0,
            pikes: 0,
            moves: 0,
            kills: 0,
            moskitos: 0,
            mud: 0,
            birth: 0
        };
        this.players = [];
        this.frogs = [];
        this.logs = [];
    };
};

/*
 *
 */
class Frog {
    constructor() {
        this.player = 0;
        this.isQueen = false;
        this.mud = 0;
        this.pos = 0;
        this.name = '';
        this.id = '';
    }
};

/*
 *
 */
class Player {
    constructor() {
        this.frogs = 4;
        this.inGame = 0;
        this.birth = null;
        this.color = ``;
        this.males = [];
    }
};

initGame(2);

/*
 *
 */
function initGame(ply) {
    game = new Game(ply);

    loadStats();
    game.stats.games++;

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
    initCells();
    drawFrogs();
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
function showTile(pos, bVisible) {
    let sType;
    let cell = getCell(pos);

    if (!game.memory && bVisible == false)
        return;

    game.map.data[pos].visible = bVisible;
    if (game.map.data[pos].visible) {
        if (game.map.data[pos].type === TYPE_MALE) {
            sType = 'type' + (game.map.data[pos].type) + (game.map.data[pos].data);
        } else {
            sType = 'type' + (game.map.data[pos].type);
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
function getFrogById(id) {
    for (let i = 0; i < game.frogs.length; i++) {
        if (game.frogs[i].id === id)
            return game.frogs[i];
    }
    return null;
}

/*
 *
 */
function getFrogByPos(pos) {
    for (let i = 0; i < game.frogs.length; i++) {
        if (game.frogs[i].pos === pos)
            return game.frogs[i];
    }
    return null;
}

/*
 *
 */
function drawPath(bVisible) {
    //console.log('drawPath : ' + cell.frog);

    let pos = game.dragCell.pos;

    let frog = getFrogByPos(pos);
    if (bVisible && (game.currentPlayer !== frog.player || !aBirth(frog) || isStuck(frog) || !isNenuphar(frog))) {
        return;
    }

    let min = pos - 10;
    let max = pos + 10;
    let count = 0;

    if (min < 0)
        min = 0;
    if (max > game.map.mapSize)
        max = game.map.mapSize;

    for (let i = min; i < max; i++) {
        let cellDropable = document.getElementById("m" + i);
        if (bVisible) {
            if (checkMove(frog.pos, i)) {
                // Cas Nénuphar on ignore la dernière position
                if (!lastPos(i)) {
                    // Juste les cases vides ou les joueurs adverses
                    if (freeSpaceAtPos(i)) {
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
    if (game.nenuphar && bVisible && count == 0) {
        game.dragCell.classList.add("inPath");
    }
}

/*
 *
 */
function initCells() {
    let cells = document.getElementsByClassName("cellMap");
    let pos = 0;

    for (let cell of cells) {
        cell.pos = pos++;
        cell.ondragover = dragoverHandler;
        cell.ondrop = dropHandler;
    };
}

/*
 *
 */
function dragoverHandler(event) {
    console.log('dragoverHandler');
    if (this.classList.contains("inPath")) {
        event.preventDefault();
    }
}

/*
 *
 */
function dropHandler(event) {
    console.log('dropHandler');
    if (this.classList.contains("inPath")) {
        moveFrog(game.dragCell, this);
        actionFrog();
    }
}

/*
 *
 */
function drawFrogs() {
    game.frogs.forEach(frog => {
        removeFrog(frog);
        drawFrog(frog);
    });
}

/*
 *
 */
function kill(frog) {
    if (frog.isQueen) {
        killPlayer(frog.player);
        console.log('Player <' + game.players[game.currentPlayer].color + '> is dead!');
        saveStats();
    }
    else {
        logFrog(frog, 'is dead!');
        killFrog(frog);
        game.stats.kill++;
    }
};

/*
 *
 */
function moveFrog(beforeCell, afterCell) {
    game.stats.moves++;

    game.players[game.currentPlayer].birth = null;

    game.lastCell = beforeCell;
    game.currentCell = afterCell;

    let oldPos = beforeCell.pos;
    let newPos = afterCell.pos;

    let type = game.map.data[oldPos].type;

    let frog = game.dragData;
    let frogB = getFrogByPos(newPos);

    if (type === TYPE_LOG) {
        let count = countFrogAtPos(newPos);
        if (count !== 0) {
            if (count === 1 && frogB.isQueen) {
                kill(frogB);
            }
            else if (count === 2) {
                kill(frogB);
            }

        }
    }

    logFrog(frog, 'Move [' + oldPos + '] >> [' + newPos + ']');

    if (frogB != null && frogB.player !== frog.player) {
        logFrog(frog, 'Kill <' + frogB.name + '>');
        kill(frogB);
    }

    removeFrog(frog);
    showTile(oldPos, false);

    frog.pos = newPos;

    showTile(newPos, true);
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

        let sPrefix = (frog.isQueen) ? 'queen_' : 'frog_';
        let sColor = sPrefix + `${colors[frog.player]}.png`;

        img.src = 'images/' + sColor;
        img.className = 'imgFrog';
        img.draggable = true;
        img.title = frog.name;
        img.id = frog.id;

        img.ondragstart = function (event) {
            console.log('ondragstart');
            game.dragData = getFrogById(event.target.id);
            game.dragCell = this.parentNode;
            drawPath(true);
        };

        img.ondragend = function (event) {
            console.log('ondragend');
            drawPath(false);
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

    table += '<tr><td id="male" class="male" colspan="' + game.map.mapWidth + '"></td></tr>';

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

    return frg;
}

/*
 *
 */
function initFrog(pos, ply) {
    for (let i = 0; i < 3; i++) {
        let frog = newFrog(playerConfig[pos][i][0], ply, playerConfig[pos][i][1]);
        game.frogs.push(frog);
        game.players[ply].inGame++;
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
    game.frogs.splice(0, game.frogs.length);
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
    let log = 'T' + game.turn + ' P' + frog.player + ' : ' + (frog.isQueen ? queenEmoji + ' ' : '') + '<' + frog.name + '> ' + msg;
    if (game.debug)
        console.log(log);
    game.logs.push(log);
    drawLog();
}

/*
 *
 */
function actionFrog() {
    let frog = game.dragData;
    let type = game.map.data[frog.pos].type;

    switch (type) {
        case TYPE_NENUPHAR:
            logFrog(frog, 'Nenuphar');
            game.nenuphar = true;
            freeze();
            break;
        case TYPE_MOSQUITO:
            logFrog(frog, 'Mosquito' + mosquitoEmoji);
            game.stats.moskitos++;
            game.nenuphar = false;
            if (game.players[frog.player].inGame > 1) {
                frog.mud = game.turn + 1;
                if (isAvailable(frog.player)) {
                    freeze();
                } else nextPlayer();
            } else nextPlayer();
            break;
        case TYPE_MUD:
            game.stats.mud++;
            frog.mud = game.turn + (game.nbPlayer * 2);
            logFrog(frog, 'Mud >> T' + frog.mud);
            nextPlayer();
            break;
        case TYPE_PIKE:
            game.stats.pikes++;
            logFrog(frog, 'Pike eats <' + frog.name + '>!');
            kill(frog);
            nextPlayer();

            break;
        case TYPE_REED:
            logFrog(frog, 'Reed');
            nextPlayer();
            break;
        case TYPE_MALE:
            logFrog(frog, 'Male');

            if (frog.isQueen) {
                // Male déjà activé ?
                if (!game.players[game.currentPlayer].males[game.map.data[frog.pos].data]) {
                    // Grenouilles en réserve ?
                    if (game.players[game.currentPlayer].frogs > 0) {
                        game.stats.birth++;
                        game.players[game.currentPlayer].males[game.map.data[frog.pos].data] = true;
                        let element = document.getElementById(colors[game.currentPlayer] + game.map.data[frog.pos].data);
                        element.classList.add("active");
                        let birth = newFrog(frog.pos, frog.player, false);
                        game.frogs.push(birth);
                        game.players[frog.player].birth = birth.id;

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
        case TYPE_LOG:
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
    game.frogs = game.frogs.filter(frg => {
        if (frg.id === frog.id) {
            game.players[frog.player].inGame--;
            game.players[frog.player].frogs++;

            removeFrog(frg);
            showTile(frg.pos, false);
            return false;
        } else return true;
    });
}

/*
 *
 */
function killPlayer(ply) {
    game.frogs = game.frogs.filter(frog => {
        if (frog.player === ply) {
            game.players[frog.player].inGame--;
            game.players[frog.player].frogs++;

            removeFrog(frog);
            showTile(frog.pos, false);
            return false;
        } else return true;
    });
}

/*
 *
 */
function isAlive() {
    let alive = 0;
    let playerAlive = 0;
    let index = 0;

    game.players.forEach(player => {
        if (player.inGame > 0) {
            alive++;
            playerAlive = index;
        }
        index++;
    });

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
        } while (game.players[game.currentPlayer].inGame === 0);

        freeze();
    }
    drawMales(game.currentPlayer);

}

/*
 *
 */
function aBirth(frog) {
    if (frog.player === game.currentPlayer && game.players[frog.player].birth !== null) {
        let tmp = getFrogById(game.players[frog.player].birth);
        if (frog.pos === tmp.pos) {
            return true;
        } else return false;
    }
    return true;
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
function isNenuphar(frog) {
    if (game.nenuphar) {
        let tmp = getFrogByPos(game.currentCell.pos);
        if (frog.id === tmp.id)
            return true;
        else return false;
    }
    return true;
}

/*
 *
 */
function freeze() {
    game.frogs.forEach(frog => {
        let img = document.getElementById(frog.id);
        if (img) {
            if ((frog.player !== game.currentPlayer) || isStuck(frog) || !isNenuphar(frog) || !aBirth(frog)) {
                img.classList.add("frozen");
            } else {
                img.classList.remove("frozen");
            }
        }
    });
}

/*
 *
 */
function isAvailable(ply) {
    let bAvailable = false;
    game.frogs.forEach(frog => {
        if ((frog.player === ply) && isNenuphar(frog) && !isStuck(frog)) {
            bAvailable = true;
        }
    });
    return bAvailable;
}

/*
 *
 */
function countFrogAtPos(i) {
    let count = 0;
    game.frogs.forEach(frog => {
        if (frog.pos === i && frog.player === game.currentPlayer)
            count++;
    });
    return count;
}

/*
 *
 */
function freeSpaceAtPos(i) {
    let count = countFrogAtPos(i);
    if (game.map.data[i].type === TYPE_LOG) {
        if (count < 2) {
            return true;
        }
    } else {
        if (count === 0)
            return true;
    }

    return false;
}

/*
 *
 */
function saveStats() {
    localStorage.setItem('data', btoa(JSON.stringify(game.stats)));
}

/*
 *
 */
function loadStats() {
    let data = localStorage.getItem('data');
    if (data !== null) {
        try {
            game.stats = JSON.parse(atob(data));
        } catch (e) {
            console.log('loadStats : ' + e.message);
        }
    }
}

/*
 *
 */
function clearStats() {
    localStorage.removeItem('data');
}

/*
 *
 */
function clearStats() {
    localStorage.removeItem('data');
}

/*
 *
 */
function drawLog() {
    let end = game.logs.length;
    let start = end - 3;

    if (start < 0) {
        start = 0;
    }

    let ligne = end - start;

    let html = '';

    for (let i = start; i < end; i++) {
        html += '<p class="log' + (ligne--) + '">' + htmlEntities(game.logs[i]) + '</p>';
    }

    let element = document.getElementById("log");
    element.textContent = ``;
    element.insertAdjacentHTML("afterbegin", html);
}

/*
 *
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}