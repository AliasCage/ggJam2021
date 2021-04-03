import * as GameConfig from '../classes/GameConfig';

export default class Hud {
    constructor(scene) {
        this.scene = scene;
        this.styleMain = {font: '36px Arial', fill: '#FFFFFF'};
        this.create();
    }

    create() {
        this.config = this.scene.game.config;
        this.bar = this.createIcon(50, 150, 'torch');
        this.torch = this.createText(110, 150);

        this.level = this.createText(360, 150, "Level: ");

        this.bar = this.createIcon(50, 50, 'food');
        this.foods = this.createText(110, 50);

        this.bar = this.createIcon(250, 50, 'silver');
        this.silver = this.createText(310, 50);

        this.bar = this.createIcon(450, 50, 'gold');
        this.gold = this.createText(510, 50);

        this.bar = this.createIcon(670, 50, 'menu');
        this.fog = this.scene.add.sprite(this.config.widthMiddle, 1500, 'fog').setOrigin(0.5).setDepth(4).setScale(GameConfig.DEFAULT_MAX_SCALE);
        this.fog.activated = false;
    }

    createText(x, y, label) {
        return this.scene.add.text(x, y, label, this.styleMain).setScrollFactor(0).setDepth(5).setOrigin(0.5);
    }

    createIcon(x, y, value) {
        return this.scene.add.sprite(x, y, 'bar', value).setScrollFactor(0).setOrigin(0.5).setDepth(5).setScale(0.1);
    }

    activateFog() {
        this.fog.x = this.scene.player.hero.x
        this.scene.tweens.add({
            targets: this.fog,
            y: this.scene.player.hero.y,
            duration: GameConfig.GAME_UP_SPEED,
            callbackScope: this,
            onComplete: function () {
                this.fog.activated = true;
            }
        })
    }

    render() {
        if (this.scene.player) {
            this.foods.setText(`${this.scene.player.foods}`);
            this.torch.setText(`${this.scene.player.torchCount}`);
            this.level.setText(`Level: ${this.scene.player.level}`);
            this.gold.setText(`${this.scene.player.gold}`);
            this.silver.setText(`${this.scene.player.silver}`);
            let scale = GameConfig.DEFAULT_MAX_SCALE;
            if (this.scene.player.torchCount < GameConfig.MAX_TORCH) {
                scale = GameConfig.DEFAULT_MIN_SCALE + GameConfig.DEFAULT_MAX_SCALE * (this.scene.player.torchCount / GameConfig.MAX_TORCH);
                if (scale > GameConfig.DEFAULT_MAX_SCALE) {
                    scale = GameConfig.DEFAULT_MAX_SCALE;
                }
            }
            if (this.scene.player.torchCount <= 0) {
                scale = GameConfig.DEFAULT_MIN_SCALE;
            }
            this.fog.setScale(scale);
        }
    }
}
