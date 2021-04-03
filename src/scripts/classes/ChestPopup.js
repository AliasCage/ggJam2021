export default class ChestPopup {
    constructor(scene, chest, label, onComplete) {
        this.scene = scene;
        this.chest = chest;
        this.label = label;
        this.onComplete = onComplete;
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

        let centreX = this.scene.cameras.main.centerX;
        let centreY = this.scene.cameras.main.centerY;
        this.title = this.createText(centreX, centreY - 110, this.label, styleHead);
        let upSide = centreY - 50;
        let downSide = centreY + 50;
        if (this.chest.food) {
            this.foods = this.createText(centreX - 100, upSide, `+${this.chest.food}`, styleMain);
            this.foodsText = this.createIcon(centreX - 40, upSide, 'food');
        }
        if (this.chest.torchCount) {
            this.torchText = this.createText(centreX + 40, upSide, `+${this.chest.torchCount}`, styleMain);
            this.torch = this.createIcon(centreX + 100, upSide, 'torch');
        }
        if (this.chest.silver) {
            this.silverText = this.createText(centreX - 100, downSide, `+${this.chest.silver}`, styleMain);
            this.silver = this.createIcon(centreX - 40, downSide, 'silver');
        }
        if (this.chest.gold) {
            this.goldText = this.createText(centreX + 40, downSide, `+${this.chest.gold}`, styleMain);
            this.gold = this.createIcon(centreX + 100, downSide, 'gold');
        }
        this.text = this.createText(centreX, centreY + 100, `Тап чтоб продожить!`, styleMain);

        this.scene.input.once('pointerdown', () => {
            this.onComplete();
            if (this.chest.food) {
                this.foodsText.setVisible(false);
                this.foods.destroy();
            }
            if (this.chest.torchCount) {
                this.torchText.setVisible(false);
                this.torch.destroy();
            }
            if (this.chest.silver) {
                this.silverText.setVisible(false);
                this.silver.destroy();
            }
            if (this.chest.gold) {
                this.goldText.setVisible(false);
                this.gold.destroy();
            }
            this.title.destroy();
            this.popup.destroy();
            this.text.destroy();
        });
    }

    createText(posX, posY, label, style) {
        return this.scene.add.text(posX, posY, label, style)
            .setOrigin(0.5)
            .setDepth(6)
            .setScrollFactor(0);
    }

    createIcon(posX, posY, value) {
        return this.scene.add.sprite(posX, posY, 'bar', value)
            .setScrollFactor(0)
            .setOrigin(0.5)
            .setDepth(6)
            .setScale(0.1);
    }
}