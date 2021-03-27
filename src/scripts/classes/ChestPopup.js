export default class ChestPopup {
    constructor(scene, chest, label, onComplete) {
        this.scene = scene;
        this.chest = chest;
        this.label = label;
        this.onComplete = onComplete;
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
            this.label,
            {font: '46px Arial', fill: '#FAFAD2'})
            .setOrigin(0.5)
            .setDepth(6)
            .setScrollFactor(0);
        let centreX = this.scene.cameras.main.centerX;
        let centreY = this.scene.cameras.main.centerY;
        if (this.chest.food) {
            this.foods = this.scene.add.text(centreX - 100, centreY - 50, "+" + this.chest.food, style).setScrollFactor(0).setDepth(6).setOrigin(0.5);
            this.foodsText = this.scene.add.sprite(centreX - 40, centreY - 50, 'bar', 'food').setScrollFactor(0).setOrigin(0.5).setDepth(6).setScale(0.1);
        }
        if (this.chest.torchCount) {
            this.torchText = this.scene.add.text(centreX + 40, centreY - 50, "+" + this.chest.torchCount, style).setScrollFactor(0).setDepth(6).setOrigin(0.5);
            this.torch = this.scene.add.sprite(centreX + 100, centreY - 50, 'bar', 'torch').setScrollFactor(0).setOrigin(0.5).setDepth(6).setScale(0.1);
        }
        if (this.chest.silver) {
            this.silverText = this.scene.add.text(centreX - 100, centreY + 50, "+" + this.chest.silver, style).setScrollFactor(0).setDepth(6).setOrigin(0.5);
            this.silver = this.scene.add.sprite(centreX - 40, centreY + 50, 'bar', 'silver').setScrollFactor(0).setOrigin(0.5).setDepth(6).setScale(0.1);
        }
        if (this.chest.gold) {
            this.goldText = this.scene.add.text(centreX + 40, centreY + 50, "+" + this.chest.gold, style).setScrollFactor(0).setDepth(6).setOrigin(0.5);
            this.gold = this.scene.add.sprite(centreX + 100, centreY + 50, 'bar', 'gold').setScrollFactor(0).setOrigin(0.5).setDepth(6).setScale(0.1);
        }
        this.text = this.scene.add.text(this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY + 100,
            `Тап чтоб продожить!`,
            style)
            .setOrigin(0.5)
            .setDepth(6)
            .setScrollFactor(0);

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
}