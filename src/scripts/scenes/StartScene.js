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
        let sizeUp = 1.2;
        let normal = 1;
        this.button.on("pointerup", function () {
                this.button.setScale(normal);
                this.startGame();
            }, this)
            .on("pointerdown", function () {
                this.button.setScale(sizeUp);
            }, this)
            .on("pointerover", function () {
                this.button.setScale(sizeUp);
            }, this)
            .on("pointerout", function () {
                this.button.setScale(normal);
            }, this);
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