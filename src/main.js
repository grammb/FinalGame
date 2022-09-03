//main file for endless runner, including arcade physics, remember to update

//tame the javashrek 
'use strict';

//global variables
let cursors;
const SCALE = 0.5;
const tileSize = 35;

//main game object defined here
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    //pixelArt: true,
    width: 620,
    height: 420,
    zoom: 2,
    physics: {
        default: "arcade",
        arcade: {
            //debug: true,
        }
    },
    scene: [Menu, Play, Score, Win]
};
let keyL, keyR, keyUp, keyDn;
let game = new Phaser.Game(config);

//can set UI sizes here, depending on what I want to include 
