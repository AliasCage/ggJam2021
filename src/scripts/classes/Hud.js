import * as GameConfig from '../classes/GameConfig';

export default class Hud {
    constructor(scene) {
        this.scene = scene;
        this.create();
    }

    create() {
        this.config = this.scene.game.config;
        const style = {font: '36px Arial', fill: '#FFFFFF'};
        this.torch = this.scene.add.text(10, 150, "Torch: ", style).setScrollFactor(0).setDepth(4);

        this.bar = this.scene.add.sprite(50, 50, 'bar', 'food').setScrollFactor(0).setOrigin(0.5).setDepth(5).setScale(0.1);
        this.foods = this.scene.add.text(110, 50, "Foods: ", style).setScrollFactor(0).setDepth(4).setOrigin(0.5);

        this.bar = this.scene.add.sprite(250, 50, 'bar', 'silver').setScrollFactor(0).setOrigin(0.5).setDepth(5).setScale(0.1);
        this.silver = this.scene.add.text(310, 50, "Silver: ", style).setScrollFactor(0).setDepth(4).setOrigin(0.5);

        this.bar = this.scene.add.sprite(450, 50, 'bar', 'gold').setScrollFactor(0).setOrigin(0.5).setDepth(5).setScale(0.1);
        this.gold = this.scene.add.text(510, 50, "Gold: ", style).setScrollFactor(0).setDepth(4).setOrigin(0.5);

        this.bar = this.scene.add.sprite(670, 50, 'bar', 'menu').setScrollFactor(0).setOrigin(0.5).setDepth(5).setScale(0.1);
        this.fog = this.scene.add.sprite(this.config.widthMiddle, this.config.widthMiddle, 'fog').setOrigin(0.5).setDepth(3).setScale(GameConfig.DEFAULT_SCALE);
    }

    render() {
        if (this.scene.player) {
            this.foods.setText(`${this.scene.player.foods}`);
            this.torch.setText(`Torch: ${this.scene.player.torchCount}`);
            this.gold.setText(`${this.scene.player.gold}`);
            this.silver.setText(`${this.scene.player.silver}`);
            let scale = GameConfig.DEFAULT_SCALE;
            if (this.scene.player.torchCount <= GameConfig.MAX_TORCH) {
                scale = GameConfig.DEFAULT_SCALE * (this.scene.player.torchCount / GameConfig.MAX_TORCH)
            }
            this.fog.setScale(scale);
        }
    }
}
