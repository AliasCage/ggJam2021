export default class ChestPopup {
    constructor(scene, cause) {
        this.scene = scene;
        this.cause = cause;
        this.create();
    }

    create() {
        const styleMain = {font: '30px Arial', fill: '#FFFFFF'};
        const styleHead = {font: '46px Arial', fill: '#FAFAD2'};
        const popupWidth = 500;
        const popupHeight = 300;

        this.popup = this.scene.add.graphics()
            .setScrollFactor(0)
            .fillStyle(0x000000, 0.7)
            .setDepth(6)
            .fillRect((this.scene.sys.game.config.width - popupWidth) / 2, (this.scene.sys.game.config.height - popupHeight) / 2, popupWidth, popupHeight);

        this.createText(`Игра окончена!`, this.scene.cameras.main.centerY - 110, styleHead);
        this.createText(this.cause, this.scene.cameras.main.centerY, styleMain);
        this.createText(`Тап чтоб продожить!`, this.scene.cameras.main.centerY + 100, styleMain);

        this.scene.input.once('pointerdown', () => {
            this.scene.sounds.gameOver.stop();
            this.scene.scene.start('Start');
        });
    }

    createText(label, posY, style) {
        return this.scene.add.text(this.scene.cameras.main.centerX, posY, label, style)
            .setOrigin(0.5)
            .setDepth(6)
            .setScrollFactor(0);
    }
}