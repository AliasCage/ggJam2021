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

        this.load.atlas('bar', barPng, barJson);
        this.load.atlas('boom', boomPng, boomJson);
        this.load.spritesheet('arrow', arrowPng, {frameWidth: 200, frameHeight: 200});
        this.load.spritesheet('blocksSet', blocksPng, {frameWidth: 100, frameHeight: 100});
        this.load.spritesheet('resSet', resSet, {frameWidth: 100, frameHeight: 100});
        this.load.tilemapTiledJSON('undergroundJson', undergroundJson);
        // this.load.audio('mining', miningWav);
    }

    create() {
        this.scene.start('Start');
    }
}