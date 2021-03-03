const heartEmoji = String.fromCodePoint(0x2764);
const heart2Emoji = String.fromCodePoint(0x1F970);
const frogEmoji = String.fromCodePoint(0x1F438);
const mosquitoEmoji = String.fromCodePoint(0x1F99F);
const trophyEmoji = String.fromCodePoint(0x1F3C6);

const PLAYER_ONE = 0;
const PLAYER_TWO = 1;
const PLAYER_THREE = 2;
const PLAYER_FOUR = 3;

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
    "visible": false,
    "busy": []
}, {
    "type": 0,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 0,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 0,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 0,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 0,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 0,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 0,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 0,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 0,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 0,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 0,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 0,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 0,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}, { // Mosquito
    "type": 1,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 1,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 1,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 1,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 1,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 1,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 1,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 1,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 1,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 1,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 1,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 1,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}, { // Mud
    "type": 2,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 2,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 2,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 2,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, { // Pike
    "type": 3,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 3,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 3,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 3,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}, { // Reed
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 4,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}, { // Male
    "type": 5,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 5,
    "back": 0,
    "data": 1,
    "visible": false,
    "busy": []
}, {
    "type": 5,
    "back": 0,
    "data": 2,
    "visible": false,
    "busy": []
}, {
    "type": 5,
    "back": 0,
    "data": 3,
    "visible": false,
    "busy": []
}, {
    "type": 5,
    "back": 0,
    "data": 4,
    "visible": false,
    "busy": []
}, {
    "type": 5,
    "back": 0,
    "data": 5,
    "visible": false,
    "busy": []
}, {
    "type": 5,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 5,
    "back": 1,
    "data": 1,
    "visible": false,
    "busy": []
}, {
    "type": 5,
    "back": 1,
    "data": 2,
    "visible": false,
    "busy": []
}, {
    "type": 5,
    "back": 2,
    "data": 3,
    "visible": false,
    "busy": []
}, {
    "type": 5,
    "back": 2,
    "data": 4,
    "visible": false,
    "busy": []
}, {
    "type": 5,
    "back": 2,
    "data": 5,
    "visible": false,
    "busy": []
}, { // Log of wood
    "type": 6,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 6,
    "back": 0,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 6,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 6,
    "back": 1,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 6,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}, {
    "type": 6,
    "back": 2,
    "data": 0,
    "visible": false,
    "busy": []
}];