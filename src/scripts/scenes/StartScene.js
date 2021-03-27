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
        let speed = GameConfig.START_MENU_UP_SPEED;
        this.tweens.add({
            targets: this.sky,
            y: -1000,
            duration: speed,
            callbackScope: this
        });
        this.tweens.add({
            targets: this.button,
            y: -1000,
            duration: speed,
            callbackScope: this,
        });
        this.tweens.add({
            targets: this.bg,
            y: -1000,
            duration: speed,
            callbackScope: this,
            onComplete: function () {
                this.scene.start('Game', {client: this.client});
            }
        })
    }

}