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

        if (this.scene.player.level === 1) {
            var startPos = this.scene.player.startPos;
            var exitPos = this.scene.map.getExit();
            var posX = GameConfig.getPosBy(startPos.column) + 50;
            var posY = GameConfig.getPosBy(startPos.row) + 50;
            var finger = this.scene.add.sprite(posX, posY, 'finger')
                .setDepth(3)
                .setOrigin(0);

            var timeline = this.scene.tweens.timeline({
                targets: finger,
                loop: 5,
                loopDelay: 1000,
                ease: 'Power1',
                totalDuration: 3000,
                onLoop: function () {
                    finger.x = posX;
                    finger.y = posY;
                },
                onComplete: function () {
                    finger.setVisible(false)
                },
                tweens: [
                    {
                        x: posX + 100,
                    },
                    {
                        y: posY - 100,
                        x: posX + 200,
                    },
                    {
                        x: posX + 300,
                    },
                    {
                        y: posY - 200,
                    }
                ]
            });

            this.scene.player.hero.on('playerMove', () => {
                finger.setVisible(false);
                timeline.stop();
                timeline.destroy();

                var toX = GameConfig.getPosBy(this.scene.draw3.exitPosition.column) +50;
                var toY = GameConfig.getPosBy(this.scene.draw3.exitPosition.row)+50;
                let x = this.scene.player.hero.x;
                let y = this.scene.player.hero.y;
                finger.setVisible(true);

                finger.x = x;
                finger.y = y;

                timeline = this.scene.tweens.timeline({
                    targets: finger,
                    loop: 5,
                    loopDelay: 1000,
                    ease: 'Power1',
                    totalDuration: 1000,
                    onLoop: function () {
                        finger.x = x;
                        finger.y = y;
                    },
                    onComplete: function () {
                        finger.setVisible(false);
                        timeline.stop();
                        timeline.destroy();
                    },
                    tweens: [
                        {
                            x: toX,
                            y: toY
                        }
                    ]
                });
            }, this.scene);
        }
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
