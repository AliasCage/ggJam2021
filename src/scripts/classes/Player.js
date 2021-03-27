import * as GameConfig from '../classes/GameConfig';
import ChestPopup from "../classes/ChestPopup";
import GameOverPopup from "../classes/GameOverPopup";
import Phaser from "phaser";

export default class Player {
    constructor(scene, stats) {
        this.scene = scene;
        this.gameConfig = scene.gameConfig;

        this.hero = this.scene.add.sprite(0, 0, 'hero');
        this.hero.setInteractive();
        this.hero.setOrigin(0.5);
        if (stats === undefined) {
            this.foods = GameConfig.FOOD;
            this.torchCount = GameConfig.TORCH;
            this.gold = 0;
            this.silver = 0;
            this.level = 1;
        } else {
            this.foods = stats.food;
            this.torchCount = stats.torchCount;
            this.gold = stats.gold;
            this.silver = stats.silver;
            this.level = stats.level;
        }

        this.hero.on('move', this.move, this);
        this.hero.on('exit', this.exit, this);
    }

    setPos(posX, posY) {
        this.hero.x = posX;
        this.hero.y = posY;
    }

    exit() {
        this.level += 1;
        this.hero.input.enable = false;
        let stats = {
            food: this.foods,
            gold: this.gold,
            silver: this.silver,
            torchCount: this.torchCount,
            level: this.level
        };
        new ChestPopup(this.scene, stats, `Пройдено! Вы добыли`, () => {
            this.scene.scene.start('Game', {playerStats: stats});
        });
        console.log("exit")
    }

    move() {
        console.log("move")
        this.foods--;
        if (this.foods <= 0) {
            this.scene.sounds.gameOver.play();
            this.scene.sounds.theme.stop();
            new GameOverPopup(this.scene, "Вы умерли от голода...")
            this.hero.input.enable = false;
            return;
        }
        if (this.torchCount > 0) {
            this.torchCount--;
        }
        let distance = Phaser.Math.Distance.Between(this.hero.x, this.hero.y, this.scene.draw3.exitColl * 100, this.scene.draw3.exitRow * 100);
        if (distance < 500){
            // showDialog();
        }
        this.scene.hud.render();
    }
    showDialog(){

    }

    useChest(chest) {
        this.foods += chest.food ? chest.food : 0;
        this.gold += chest.gold ? chest.gold : 0;
        this.silver += chest.silver ? chest.silver : 0;
        this.torchCount += chest.torchCount ? chest.torchCount : 0;
    }

    collect(itemId) {
        console.log('collect ' + itemId);
        if (itemId === 0) {
            this.scene.sounds.dig.play();
        }
        if (itemId === 2) {
            this.gold++;
            this.scene.sounds.mine.play();
        }
        if (itemId === 1) {
            this.scene.sounds.mine.play();
            this.silver++;
        }
        if (itemId === 4) {
            this.foods++;
            this.scene.sounds.food.play();
        }
        if (itemId === 5) {
            this.scene.sounds.chest.play();
            var chest = {};
            if (Math.random() < GameConfig.CHEST_FOOD_PERCENT) {
                chest.food = Math.floor(Math.random() * GameConfig.CHEST_MAX_FOOD) + GameConfig.CHEST_MIN_FOOD;
            }
            if (Math.random() < GameConfig.CHEST_GOLD_PERCENT0) {
                chest.gold = Math.floor(Math.random() * GameConfig.CHEST_MAX_GOLD) + GameConfig.CHEST_MIN_GOLD;
            }
            if (Math.random() < GameConfig.CHEST_SILVER_PERCENT) {
                chest.silver = Math.floor(Math.random() * GameConfig.CHEST_MAX_SILVER) + GameConfig.CHEST_MIN_SILVER;
            }
            if (Math.random() < GameConfig.CHEST_TORCH_PERCENT) {
                chest.torchCount = Math.floor(Math.random() * GameConfig.CHEST_MAX_TORCH) + GameConfig.CHEST_MIN_TORCH;
            }
            new ChestPopup(this.scene, chest, `Найден сундук!`, () => {
                this.useChest(chest)
            });
        }
    }
}