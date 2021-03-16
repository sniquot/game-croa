"use strict";

/*
 *
 */
class Computer {
    constructor() {
    }


    /*
     * Retourne la première grenouille disponible.
     * 
     */
    comp_find_frog_available() {
    }

    /*
     * Retoune une case disponible
     * Avec prise de risque ou pas.
     */
    comp_move(risk) {
    }

    /*
     * Retourne la case la plus proche de la destination
     */
    comp_move_to(pos) {
    }

    /*
     * Retourne la case la plus proche de la destination
     */
    comp_find_closer_type(type) {
    }

    /*
     * Retourne la distance entre deux positions
     */
    comp_count_dist(fromPos, toPos) {

        let posFx = (fromPos % game.map.mapWidth);
        let posTx = (toPos % game.map.mapWidth);
        let diffx = Math.abs(posFx - posTx);

        let posFy = Math.floor(fromPos / game.map.mapHeight);
        let posTy = Math.floor(toPos / game.map.mapHeight);
        let diffy = Math.abs(posFy - posTy);

        if (diffx > diffy) return diffx;
        else if (diffx < diffy) return diffy;

        return 0;

    }
};