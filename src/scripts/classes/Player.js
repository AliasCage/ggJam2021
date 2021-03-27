import * as GameConfig from '../classes/GameConfig';
import ChestPopup from "../classes/ChestPopup";
import GameOverPopup from "../classes/GameOverPopup";

export default class Player {
    constructor(scene) {
        this.scene = scene;
        this.gameConfig = scene.gameConfig;

        this.hero = this.scene.add.sprite(0, 0, 'hero');
        this.hero.setInteractive();
        this.hero.setOrigin(0.5);
        this.foods = GameConfig.FOOD;
        this.torchCount = GameConfig.TORCH;
        this.gold = 0;
        this.silver = 0;

        this.hero.on('move', this.move, this);
        this.hero.on('exit', this.move, this);
    }

    setPos(posX, posY) {
        this.hero.x = posX;
        this.hero.y = posY;
    }

    exit() {
        console.log("exit")
    }

    move() {
        console.log("move")
        this.foods--;
        if (this.foods <= 0) {
            new GameOverPopup(this.scene, "Вы умерли от голода...")
            this.hero.input.enable = false;
            return;
        }
        if (this.torchCount > 0) {
            this.torchCount--;
        }
        this.scene.hud.render();
    }

    useChest(chest) {
        this.foods += chest.food ? chest.food : 0;
        this.gold += chest.gold ? chest.gold : 0;
        this.silver += chest.silver ? chest.silver : 0;
        this.torchCount += chest.torchCount ? chest.torchCount : 0;
    }

    collect(itemId) {
        console.log('collect');
        if (itemId === 2) {
            this.gold++;
        }
        if (itemId === 1) {
            this.silver++;
        }
        if (itemId === 4) {
            this.foods++;
        }
        if (itemId === 5) {
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
            new ChestPopup(this.scene, chest, () => {
                this.useChest(chest)
            });
        }
    }
}