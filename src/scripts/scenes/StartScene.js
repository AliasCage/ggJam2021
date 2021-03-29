import Phaser from "phaser";
import * as GameConfig from '../classes/GameConfig';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super("Start");
    }

    create() {
        this.config = this.game.config;
        this.createBackground();
        this.createButtons();
        this.setEvents();
        this.createSound();
    }

    createSound() {
        if (this.wind === undefined) {
            this.wind = this.sound.add('wind', {volume: GameConfig.VOLUME_WIND, loop: true});
        }
        this.wind.play();
    }

    createBackground() {
        this.bg = this.add.sprite(0, 0, 'bg').setOrigin(0);
        this.sky = this.add.tileSprite(720, 600, 720, 230, 'sky').setOrigin(1);
    }

    update() {
        this.sky.tilePositionX += 0.3;
    }

    createButtons() {
        this.button = this.add.sprite(this.cameras.main.centerX,
            this.config.height * 0.85, 'start')
            .setOrigin(0.5)
            .setInteractive();
    }

    setEvents() {
        this.button.on('pointerdown', this.startGame, this);
    }

    startGame() {
        this.createUpTween(this.sky);
        this.createUpTween(this.button);
        this.createUpTween(this.bg, function () {
            this.wind.stop();
            this.scene.start('Game', {isNewGame: true});
        });
    }

    createUpTween(target, onComplete) {
        this.tweens.add({
            targets: target,
            y: target.y - 1500,
            duration: GameConfig.START_MENU_UP_SPEED,
            callbackScope: this,
            onComplete: onComplete
        });
    }

}