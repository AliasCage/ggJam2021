import Phaser from "phaser";
import LoadingBar from '../classes/LoadingBar';
import undergroundJson from '../../assets/underground.json';
import blocksPng from '../../assets/blocks.png';
import resSet from '../../assets/resources.png';
import hero from '../../assets/hero.png';
import fogPng from "../../assets/fog.png";
import arrowPng from "../../assets/arrow.png";

import barPng from "../../assets/bar.png";
import barJson from "../../assets/bar.json";

import boomPng from "../../assets/booom.png";
import boomJson from "../../assets/booom.json";
import startPng from "../../assets/start.png";
import skyPng from "../../assets/skies.png";

import dialog1Png from "../../assets/HeroDial1.png";
import dialog2Png from "../../assets/HeroDial2.png";
import dialog3Png from "../../assets/HeroDial3.png";
import dialog4Png from "../../assets/HeroDial4.png";
import dialog5Png from "../../assets/HeroDial5.png";

import chestSound from "../../assets/sounds/chest.mp3";
import digSound from "../../assets/sounds/Dig.mp3";
import gameOverSound from "../../assets/sounds/GAMEOVER.mp3";
import mineSound from "../../assets/sounds/Mine.mp3";
import foodSound from "../../assets/sounds/Mushroom.mp3";
import themeSound from "../../assets/sounds/Music.mp3";
import rockFallSound from "../../assets/sounds/RockFall.mp3";
import windSound from "../../assets/sounds/wind.mp3";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        this.add.sprite(0, 0, 'bg').setOrigin(0);
        this.loadingBar = new LoadingBar(this);
        this.load.image('hero', hero);
        this.load.image('fog', fogPng);
        this.load.image('start', startPng);
        this.load.image('sky', skyPng);

        this.load.image('dialog1',dialog1Png);
        this.load.image('dialog2',dialog2Png);
        this.load.image('dialog3',dialog3Png);
        this.load.image('dialog4',dialog4Png);
        this.load.image('dialog5',dialog5Png);

        this.load.atlas('bar', barPng, barJson);
        this.load.atlas('boom', boomPng, boomJson);
        this.load.spritesheet('arrow', arrowPng, {frameWidth: 200, frameHeight: 200});
        this.load.spritesheet('blocksSet', blocksPng, {frameWidth: 100, frameHeight: 100});
        this.load.spritesheet('resSet', resSet, {frameWidth: 100, frameHeight: 100});
        this.load.tilemapTiledJSON('undergroundJson', undergroundJson);

        this.load.audio('chest', chestSound);
        this.load.audio('dig', digSound);
        this.load.audio('gameOver', gameOverSound);
        this.load.audio('mine', mineSound);
        this.load.audio('food', foodSound);
        this.load.audio('theme', themeSound);
        this.load.audio('rockFall', rockFallSound);
        this.load.audio('wind', windSound);
    }

    create() {
        this.scene.start('Start');
    }
}