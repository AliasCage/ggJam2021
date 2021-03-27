import Phaser from "phaser";

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
        this.add.sprite(0, 0, 'bg').setOrigin(0);
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
        this.scene.start('Game', {client: this.client});
    }

    requestGame() {
        // инициализировать клиент
        // this.client = new Client();
        // отправить запрос игры на сервер
        // this.client.init();
        // // по факту получения противника начать игру
        // this.client.on('game', this.startGame, this);
    }
}