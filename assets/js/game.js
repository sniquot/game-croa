"use strict";

/*
 *
 */
class Game {
    static turn = 0;
    static nbFrogs = 0;
    static nbPlayer = 2;

    static lasPos = 0;
    static dragPos = 0;

    static nenuphar = null;
    static birth = null;
    static currentPlayer = null;

    static players = [];
    static frogs = [];
    static logs = [];

    static debug = false;
    static memory = false;

    /*
     *
     */
    static init(ply, memory, debug) {
        console.log('Game.init');
        Game.debug = debug;
        Game.nbPlayer = ply;
        Game.memory = memory;

        Stuff.shuffleArray(colors);
        Stuff.shuffleArray(names);

        Game.initStats();
        Game.initPlayers();
        Game.initFrogs();
        Game.initMales();
        Game.initMap();

        Game.freeze();

        Game.stats.games++;
    }


    /*
     *
     */
    static initStats() {
        console.log('Game.initStats');
        Game.stats = new Stats();
        Game.stats.load();
    }

    /*
     *
     */
    static initPlayers() {
        console.log('Game.initPlayers');
        for (let i = 0; i < Game.nbPlayer; i++) {
            Game.players[i] = new Player(colors[i], false);
        }
        Game.currentPlayer = Game.players[0];
    }

    /*
     *
     */
    static initFrogs() {
        console.log('Game.initFrogs');
        Game.frogs = [];
        switch (Game.nbPlayer) {
            case 3:
                Game.initFrog('topLeft', 0);
                Game.initFrog('botLeft', 1);
                Game.initFrog('midRight', 2);
                break;
            case 4:
                Game.initFrog('topLeft', 0);
                Game.initFrog('botLeft', 1);
                Game.initFrog('botRight', 2);
                Game.initFrog('topRight', 3);
                break;
            default:
                Game.initFrog('topLeft', 0);
                Game.initFrog('botRight', 1);
        }
    }

    /*
     *
     */
    static initFrog(pos, ply) {
        console.log('Game.initFrog');
        for (let i = 0; i < 3; i++) {
            let frog = new Frog(playerConfig[pos][i][0], ply, playerConfig[pos][i][1]);
            Game.frogs.push(frog);
            Game.players[ply].inGame++;
        }
    }

    /*
     *
     */
    static initMales() {
        console.log('Game.initMales');
        for (let i = 0; i < Game.nbPlayer; i++) {
            Game.players[i].resetMales();
        }
    }

    /*
     *
     */
    static initMap() {
        console.log('Game.initMap');
        Map.reset();
        Map.drawMap();
        Game.drawFrogs();

        Game.currentPlayer.drawMales();
    }

    /*
     *
     */
    static getFrogById(id) {
        console.log('Game.getFrogById');
        for (let i = 0; i < Game.frogs.length; i++) {
            if (Game.frogs[i].id === id)
                return Game.frogs[i];
        }
        return null;
    }

    /*
     *
     */
    static getFrogByPos(pos) {
        console.log('Game.getFrogByPos');
        for (let i = 0; i < Game.frogs.length; i++) {
            if (Game.frogs[i].pos === pos)
                return Game.frogs[i];
        }
        return null;
    }

    /*
     *
     */
    static drawFrogs() {
        console.log('Game.drawFrogs');
        Game.frogs.forEach(frog => {
            frog.remove();
            frog.draw();
        });
    }

    /*
     *
     */
    static killFrog(frog) {
        Game.frogs = Game.frogs.filter(frg => {
            if (frg.id === frog.id) {
                Game.players[frg.player].inGame--;
                Game.players[frg.player].frogs++;

                frg.remove();
                Map.showTile(frg.pos, false);
                return false;
            } else return true;
        });
    }

    /*
     *
     */
    static countFrogAtPos(pos) {
        let count = 0;
        Game.frogs.forEach(frog => {
            if (frog.pos === pos && frog.player === Game.currentPlayer.id)
                count++;
        });
        return count;
    }

    /*
     *
     */
    static freeSpaceAtPos(pos) {
        let count = Game.countFrogAtPos(pos);
        if (Map.data[pos].type === TYPE_LOG) {
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
    static freeze() {
        Game.frogs.forEach(frog => {
            let img = document.getElementById(frog.id);
            if (img) {
                if ((frog.player !== Game.currentPlayer.id) || frog.isStuck() || !frog.isNenuphar() || !frog.aBirth()) {
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
    static isAvailable() {
        let bAvailable = false;
        Game.frogs.forEach(frog => {
            if ((frog.player === Game.currentPlayer.id) && frog.isNenuphar() && frog.isStuck()) {
                bAvailable = true;
            }
        });
        return bAvailable;
    }

    /*
     *
     */
    static kill(frog) {
        if (frog.isQueen) {
            console.log('Player <' + Game.currentPlayer.color + '> is dead! ' + deathEmoji);
            Game.killPlayer(frog.player);
            Game.stats.save();
        }
        else {
            Game.logFrog(frog, 'is dead! ' + deathEmoji);
            Game.killFrog(frog);
            Game.stats.kills++;
        }
    };

    /*
     *
     */
    static killPlayer(ply) {
        Game.frogs = Game.frogs.filter(frog => {
            if (frog.player === ply) {
                Game.players[frog.player].inGame--;
                Game.players[frog.player].frogs++;

                frog.removeFrog();
                Map.showTile(frog.pos, false);
                return false;
            } else return true;
        });
    }

    /*
     *
     */
    static drawLog() {
        let end = Game.logs.length;
        let start = end - 3;

        if (start < 0) {
            start = 0;
        }

        let ligne = end - start;

        let html = '';

        for (let i = start; i < end; i++) {
            html += '<p class="log' + (ligne--) + '">' + Stuff.htmlEntities(Game.logs[i]) + '</p>';
        }

        let element = document.getElementById("log");
        element.textContent = ``;
        element.insertAdjacentHTML("afterbegin", html);
    }

    /*
     *
     */
    static nextPlayer() {
        if (!Game.isAlive()) {
            console.log('Game finish, player <' + Game.currentPlayer.color + '> win! ' + trophyEmoji);
        } else {
            Game.turn++;
            Game.nenuphar = null;

            // Ignore les joueurs morts.
            do {
                Game.currentPlayer = Game.players[(Game.currentPlayer.id + 1) % Game.nbPlayer];
            } while (Game.currentPlayer.inGame === 0);

            Game.freeze();
        }
        Game.currentPlayer.drawMales();

    }

    /*
     *
     */
    static isAlive() {
        let alive = 0;
        let playerAlive = null;

        Game.players.forEach(player => {
            if (player.inGame > 0) {
                alive++;
                playerAlive = player;
            }
        });

        if (alive > 1)
            return true;

        Game.currentPlayer = playerAlive;
        return false;
    }

    /*
     *
     */
    static logFrog(frog, msg) {
        let log = 'T' + Game.turn + ' P' + frog.player + ' : ' + (frog.isQueen ? queenEmoji + ' ' : '') + '<' + frog.name + '> ' + msg;
        if (Game.debug)
            console.log(log);
        Game.logs.push(log);
        Game.drawLog();
    }
    /*
     *
     */
    static moveFrog(newPos) {
        Game.stats.moves++;
        Game.birth = null;

        Game.lastPos = Game.dragPos;
        let type = Map.data[Game.lastPos].type;

        let frog = Game.getFrogByPos(Game.lastPos);
        let frogB = Game.getFrogByPos(newPos);

        if (type === TYPE_LOG) {
            let count = Game.countFrogAtPos(newPos);
            if (count !== 0) {
                if (count === 1 && frogB.isQueen) {
                    Game.kill(frogB);
                }
                else if (count === 2) {
                    Game.kill(frogB);
                }

            }
        }

        Game.logFrog(frog, 'Move [' + Game.lastPos + '] >> [' + newPos + ']');

        if (frogB != null && frogB.player !== frog.player) {
            Game.logFrog(frog, 'Kill <' + frogB.name + '>');
            Game.kill(frogB);
        }

        frog.remove();
        Map.showTile(Game.lastPos, false);

        frog.pos = newPos;

        Map.showTile(newPos, true);
        frog.draw();

    }

    /*
     *
     */
    static actionFrog(newPos) {
        let frog = Game.getFrogByPos(newPos);
        let type = Map.data[frog.pos].type;

        switch (type) {
            case TYPE_NENUPHAR:
                Game.logFrog(frog, 'Nenuphar');
                Game.nenuphar = frog;
                Game.freeze();
                break;
            case TYPE_MOSQUITO:
                Game.logFrog(frog, 'Mosquito ' + mosquitoEmoji);
                Game.stats.moskitos++;
                Game.nenuphar = null;
                if (Game.players[frog.player].inGame > 1) {
                    frog.mud = Game.turn + 1;
                    if (Game.isAvailable()) {
                        Game.freeze();
                    } else Game.nextPlayer();
                } else Game.nextPlayer();
                break;
            case TYPE_MUD:
                Game.stats.muds++;
                frog.mud = Game.turn + (Game.nbPlayer * 2);
                Game.logFrog(frog, 'Mud >> T' + frog.mud);
                Game.nextPlayer();
                break;
            case TYPE_PIKE:
                Game.stats.pikes++;
                Game.logFrog(frog, 'Pike eats <' + frog.name + '>!');
                Game.kill(frog);
                Game.nextPlayer();

                break;
            case TYPE_REED:
                Game.logFrog(frog, 'Reed');
                Game.nextPlayer();
                break;
            case TYPE_MALE:
                Game.logFrog(frog, 'Male');

                if (frog.isQueen) {
                    // Male déjà activé ?
                    if (!Game.currentPlayer.males[Map.data[frog.pos].data]) {
                        // Grenouilles en réserve ?
                        if (Game.currentPlayer.frogs > 0) {
                            Game.stats.births++;
                            Game.currentPlayer.males[Map.data[frog.pos].data] = true;
                            let element = document.getElementById(colors[Game.currentPlayer.id] + Map.data[frog.pos].data);
                            element.classList.add("active");
                            let birth = new Frog(frog.pos, frog.player, false);
                            Game.frogs.push(birth);
                            Game.birth = birth;

                            Game.players[frog.player].frogs--;
                            Game.logFrog(birth, 'was born!' + heart2Emoji);
                            Game.drawFrog(birth);
                        }
                        else
                            Game.logFrog(frog, 'no more frogs available!');
                    } else
                        Game.logFrog(frog, 'have already sex with this male!');
                }
                Game.nextPlayer();
                break;
            case TYPE_LOG:
                Game.logFrog(frog, 'Log');
                Game.nextPlayer();
                break;

            default:
                Game.logFrog(frog, "Unknow Type : " + type);
                break;
        }

    }

};

