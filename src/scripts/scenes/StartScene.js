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
    }

    createButtons() {
        console.log(this);
        this.button1 = this.add.text(this.cameras.main.centerX,
            this.config.height * 0.7,
            'Копать',
            {font: 'bold 88px Arial', fill: '#FAFAD2'})
            .setOrigin(0.5)
            .setInteractive();
    }

    setEvents() {
        this.button1.on('pointerdown', this.startGame, this);
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