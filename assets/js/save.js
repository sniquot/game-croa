"use strict";

/*
 *
 */
function saveGame(slot) {
    let saveSlot = 'save' + slot;
    //    if (localStorage.getItem(saveSlot) === null) {
    localStorage.setItem(saveSlot, btoa(JSON.stringify(game)));
    //}
}

/*
 *
 */
function loadGame(slot) {
    let saveSlot = 'save' + slot;
    let save = null;
    //    if (localStorage.getItem(saveSlot) === null) {
    save = localStorage.getItem(saveSlot);
    save = JSON.parse(atob(save));

    console.log(save);
    //}
}

/*
 *
 */
function deleteGame(slot) {
    let saveSlot = 'save' + slot;
    localStorage.removeItem(saveSlot);
}
