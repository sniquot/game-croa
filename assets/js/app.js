"use strict";

var game;

game = new Game();

game.init(2, false, true);

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
    let posAx = (posAfter % game.map.mapWidth);
    let diffx = Math.abs(posBx - posAx);
    if (diffx > 1)
        return false;

    return true;
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
function kill(frog) {
    if (frog.isQueen) {
        killPlayer(frog.player);
        console.log('Player <' + game.players[game.currentPlayer].color + '> is dead!');
        game.stats.save();
    }
    else {
        logFrog(frog, 'is dead!');
        killFrog(frog);
        game.stats.kills++;
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
function drawMales(ply) {
    let image = ``;

    for (let i = 0; i < game.players[ply].frogs; i++) {
        image += `<img src="` + IMG_PATH + `frog_${game.players[ply].color}.png" class="extra${game.players[ply].color}" alt="Extra ${game.players[ply].color} Frog">`;
    }

    for (let i = 0; i < 6; i++) {
        let cssclass = ``;
        if (game.players[ply].males[i]) { cssclass = `active`; }
        image += `<img src="` + IMG_PATH + `mini5${i}.png" id="${game.players[ply].color + i}" class="mini ${cssclass}" alt="Male ${game.players[ply].color} ${cssclass}">`;
    }

    let element = document.getElementById("male");
    element.innerHTML = image;
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
            game.stats.muds++;
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
                        game.stats.births++;
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
