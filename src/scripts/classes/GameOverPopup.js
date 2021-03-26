export default class ChestPopup {
    constructor(scene, cause) {
        this.scene = scene;
        this.cause = cause;
        this.create();
    }

    create() {
        const style = {font: '30px Arial', fill: '#FFFFFF'};
        const popupWidth = 500;
        const popupHeight = 300;

        this.popup = this.scene.add.graphics()
            .setScrollFactor(0)
            .fillStyle(0x000000, 0.7)
            .setDepth(6)
            .fillRect((this.scene.sys.game.config.width - popupWidth) / 2, (this.scene.sys.game.config.height - popupHeight) / 2, popupWidth, popupHeight);

        this.title = this.scene.add.text(this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY - 110,
            `Игра окончена!`,
            {font: '46px Arial', fill: '#FAFAD2'})
            .setOrigin(0.5)
            .setDepth(6)
            .setScrollFactor(0);

        this.text = this.scene.add.text(this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            this.cause,
            style)
            .setOrigin(0.5)
            .setDepth(6)
            .setScrollFactor(0);

        this.text = this.scene.add.text(this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY + 100,
            `Тап чтоб продожить!`,
            style)
            .setOrigin(0.5)
            .setDepth(6)
            .setScrollFactor(0);

        this.scene.input.once('pointerdown', () => {
            this.scene.scene.start('Start');
        });
    }
}