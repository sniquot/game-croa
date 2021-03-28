"use strict";
const IMG_PATH = 'assets/images/';

const heartEmoji = String.fromCodePoint(0x2764);
const heart2Emoji = String.fromCodePoint(0x1F970);
const frogEmoji = String.fromCodePoint(0x1F438);
const mosquitoEmoji = String.fromCodePoint(0x1F99F);
const trophyEmoji = String.fromCodePoint(0x1F3C6);
const queenEmoji = String.fromCodePoint(0x1F451);
const deathEmoji = String.fromCodePoint(0x2620);

const PLAYER_ONE = 0;
const PLAYER_TWO = 1;
const PLAYER_THREE = 2;
const PLAYER_FOUR = 3;

const TYPE_NENUPHAR = 0;
const TYPE_MOSQUITO = 1;
const TYPE_MUD = 2;
const TYPE_PIKE = 3;
const TYPE_REED = 4;
const TYPE_MALE = 5;
const TYPE_LOG = 6;

const colors = ['blue', 'red', 'green', 'pink'];

const playerConfig = {
    'topLeft': [ // Top Left corner
        [0, true],
        [1, false],
        [8, false]
    ],
    'topRight': [ // Top Right corner
        [7, true],
        [6, false],
        [15, false]
    ],
    'botLeft': [ // Bottom Left corner
        [56, true],
        [48, false],
        [57, false]
    ],
    'botRight': [ // Bottom Right corner
        [63, true],
        [62, false],
        [55, false]
    ],
    'midRight': [ // Middle Right
        [39, true],
        [30, false],
        [46, false]
    ]
};

const names = ['Atlas', 'Arf', 'Ange',
    'Brute', 'Buster', 'Bulles',
    'Cindra', 'Carmin', 'Charlotte',
    'Donny', 'Diego', 'Daphne',
    'Erland', 'Éthyle', 'Ethan',
    'Franky', 'Froggie', 'Francesca',
    'George', 'Gus', 'Geppetto',
    'Hudini', 'Holli', 'Homère',
    'Jaspe', 'Jake', 'Jezabelle',
    'Kahlua', 'Kermit', 'Korah',
    'Mangue', 'Mandy', 'Minnie',
    'Nitrus', 'Néo', 'Ned',
    'Onix', 'Prince', 'Ralph',
    'Spotts', 'Shiva', 'Trevor',
    'Toadie', 'Trixie', 'Tuela',
    'Cindra', 'Yoda', 'Zoé'
];

const dalles = [{ // Nenuphar
    "type": 0,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 0,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 0,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 0,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 0,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 0,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 0,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 0,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 0,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 0,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 0,
    "back": 2,
    "data": 0,
    "visible": false

}, {
    "type": 0,
    "back": 2,
    "data": 0,
    "visible": false

}, {
    "type": 0,
    "back": 2,
    "data": 0,
    "visible": false

}, {
    "type": 0,
    "back": 2,
    "data": 0,
    "visible": false

}, { // Mosquito
    "type": 1,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 1,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 1,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 1,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 1,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 1,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 1,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 1,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 1,
    "back": 2,
    "data": 0,
    "visible": false

}, {
    "type": 1,
    "back": 2,
    "data": 0,
    "visible": false

}, {
    "type": 1,
    "back": 2,
    "data": 0,
    "visible": false

}, {
    "type": 1,
    "back": 2,
    "data": 0,
    "visible": false

}, { // Mud
    "type": 2,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 2,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 2,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 2,
    "back": 0,
    "data": 0,
    "visible": false

}, { // Pike
    "type": 3,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 3,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 3,
    "back": 2,
    "data": 0,
    "visible": false

}, {
    "type": 3,
    "back": 2,
    "data": 0,
    "visible": false

}, { // Reed
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 2,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 2,
    "data": 0,
    "visible": false

}, {
    "type": 4,
    "back": 2,
    "data": 0,
    "visible": false

}, { // Male
    "type": 5,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 5,
    "back": 0,
    "data": 1,
    "visible": false

}, {
    "type": 5,
    "back": 0,
    "data": 2,
    "visible": false

}, {
    "type": 5,
    "back": 0,
    "data": 3,
    "visible": false

}, {
    "type": 5,
    "back": 0,
    "data": 4,
    "visible": false

}, {
    "type": 5,
    "back": 0,
    "data": 5,
    "visible": false

}, {
    "type": 5,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 5,
    "back": 1,
    "data": 1,
    "visible": false

}, {
    "type": 5,
    "back": 1,
    "data": 2,
    "visible": false

}, {
    "type": 5,
    "back": 2,
    "data": 3,
    "visible": false

}, {
    "type": 5,
    "back": 2,
    "data": 4,
    "visible": false

}, {
    "type": 5,
    "back": 2,
    "data": 5,
    "visible": false

}, { // Log of wood
    "type": 6,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 6,
    "back": 0,
    "data": 0,
    "visible": false

}, {
    "type": 6,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 6,
    "back": 1,
    "data": 0,
    "visible": false

}, {
    "type": 6,
    "back": 2,
    "data": 0,
    "visible": false

}, {
    "type": 6,
    "back": 2,
    "data": 0,
    "visible": false

}];