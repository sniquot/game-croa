"use strict";

/*
 *
 */
class Game {
    turn = 0;
    currentCell = null;
    dragCell = null;
    dragData = '';
    lastCell = null;
    nenuphar = false;
    currentPlayer = 0;
    nbFrogs = 0;
    map = null;
    players = [];
    frogs = [];
    logs = [];

    debug = false;
    nbPlayer = 2;
    memory = false;

    /*
 *
 */
    init(ply, memory, debug) {
        this.debug = debug;
        this.nbPlayer = ply;
        this.memory = memory;

        Stuff.shuffleArray(colors);
        Stuff.shuffleArray(names);

        this.initStats();
        this.initPlayers();
        this.initFrogs();
        this.initMales();
        this.initMap();

        freeze();

        this.stats.games++;
    }


    /*
     *
     */
    initStats() {
        console.log('initStats');
        this.stats = new Stats();
        this.stats.load();
    }

    /*
     *
     */
    initPlayers() {
        console.log('initPlayers');
        for (let i = 0; i < this.nbPlayer; i++) {
            this.players[i] = new Player(colors[i]);
        }
    }

    /*
     *
     */
    initFrogs() {
        this.frogs = [];
        switch (this.nbPlayer) {
            case 3:
                this.initFrog('topLeft', 0);
                this.initFrog('botLeft', 1);
                this.initFrog('midRight', 2);
                break;
            case 4:
                this.initFrog('topLeft', 0);
                this.initFrog('botLeft', 1);
                this.initFrog('botRight', 2);
                this.initFrog('topRight', 3);
                break;
            default:
                this.initFrog('topLeft', 0);
                this.initFrog('botRight', 1);
        }
    }

    /*
     *
     */
    initFrog(pos, ply) {
        for (let i = 0; i < 3; i++) {
            let frog = Frog.newFrog(playerConfig[pos][i][0], ply, playerConfig[pos][i][1]);
            this.frogs.push(frog);
            this.players[ply].inGame++;
        }
    }

    /*
     *
     */
    initMales() {
        for (let i = 0; i < this.nbPlayer; i++) {
            this.players[i].resetMales();
        }
    }

    /*
     *
     */
    initMap() {
        this.map = new Map();
        this.map.reset();
        this.map.drawMap();
        drawFrogs();
        drawMales(game.currentPlayer);
    }


};




