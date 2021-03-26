const FOOD = 10;
const TORCH = 18;
const MIN_TORCH_COUNT = 5;

const CHEST_MIN_FOOD = 3;
const CHEST_MAX_FOOD = 20;
const CHEST_FOOD_PERCENT = 0.5;
const CHEST_MIN_GOLD = 1;
const CHEST_MAX_GOLD = 10;
const CHEST_GOLD_PERCENT0 = 0.3;
const CHEST_MIN_SILVER = 2;
const CHEST_MAX_SILVER = 10;
const CHEST_SILVER_PERCENT = 0.3;
const CHEST_MIN_TORCH = 5;
const CHEST_MAX_TORCH = 20;
const CHEST_TORCH_PERCENT = 0.5;

export default class Player {
    constructor(scene) {
        this.scene = scene;

        this.hero = this.scene.add.sprite(0, 0, 'hero');
        this.hero.setInteractive();
        this.hero.setOrigin(0.5);
        this.foods = FOOD;
        this.torchCount = TORCH;
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
        this.foods--;
        this.torchCount--;
        this.scene.hud.render();
    }

    collect(itemId) {
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
            if (Math.random() < CHEST_FOOD_PERCENT) {
                this.foods += Math.floor(Math.random() * CHEST_MAX_FOOD) + CHEST_MIN_FOOD;
            }
            if (Math.random() < CHEST_GOLD_PERCENT0) {
                this.gold += Math.floor(Math.random() * CHEST_MAX_GOLD) + CHEST_MIN_GOLD;
            }
            if (Math.random() < CHEST_SILVER_PERCENT) {
                this.silver += Math.floor(Math.random() * CHEST_MAX_SILVER) + CHEST_MIN_SILVER;
            }
            if (Math.random() < CHEST_TORCH_PERCENT) {
                this.torchCount += Math.floor(Math.random() * CHEST_MAX_TORCH) + CHEST_MIN_TORCH;
            }
        }
    }
}