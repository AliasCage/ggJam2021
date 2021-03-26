import Phaser from "phaser";
import LoadingBar from '../classes/LoadingBar';
import undergroundJson from '../../assets/underground.json';
import blocksPng from '../../assets/blocks.png';
import resSet from '../../assets/resources.png';
import hero from '../../assets/hero.png';
import bgPng from "../../assets/bg.png";
import fogPng from "../../assets/fog.png";
import arrowPng from "../../assets/arrow.png";

import barPng from "../../assets/bar.png";
import barJson from "../../assets/bar.json";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        this.add.sprite(0, 0, bgPng).setOrigin(0);
        this.loadingBar = new LoadingBar(this);
        this.load.image('hero', hero);
        this.load.image('fog', fogPng);

        this.load.atlas('bar', barPng, barJson);
        this.load.spritesheet('arrow', arrowPng, {frameWidth: 200, frameHeight: 200});
        this.load.spritesheet('blocksSet', blocksPng, {frameWidth: 100, frameHeight: 100});
        this.load.spritesheet('resSet', resSet, {frameWidth: 100, frameHeight: 100});
        this.load.tilemapTiledJSON('undergroundJson', undergroundJson);
    }

    create() {
        this.scene.start('Start');
    }
}