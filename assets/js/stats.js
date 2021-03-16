"use strict";

/*
 *
 */
class Stats {
    games = 0;
    pikes = 0;
    moves = 0;
    kills = 0;
    moskitos = 0;
    muds = 0;
    births = 0;

    /*
     *
     */
    save() {
        localStorage.setItem('data', btoa(JSON.stringify(this)));
    }

    /*
     *
     */
    load() {
        let data = localStorage.getItem('data');
        if (data !== null) {
            try {
                data = JSON.parse(atob(data));
                this.games = data.games;
                this.pikes = data.pikes;
                this.moves = data.moves;
                this.kills = data.kills;
                this.moskitos = data.moskitos;
                this.muds = data.births;
            } catch (e) {
                console.log('loadStats : ' + e.message);
            }
        }
    }

    /*
     *
     */
    clear() {
        localStorage.removeItem('data');
    }

};
