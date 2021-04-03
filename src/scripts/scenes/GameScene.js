import Phaser from "phaser";
import Map from '../classes/Map';
import Draw3P from '../classes/Draw3P';
import Player from '../classes/Player';
import Hud from '../classes/Hud';
import RockFall from '../classes/RockFall';
import * as GameConfig from '../classes/GameConfig';

let gameOptions = {
    fallSpeed: 100,
    destroySpeed: 200,
    moveSpeed: 100,
}

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init(data) {
        this.playerStats = data.playerStats;
        console.log(data)
    }

    preload() {
    }

    cameraFollow() {
        this.cameras.main.setBounds(0, 0, this.map.tilemap.widthInPixels, this.map.tilemap.heightInPixels);
        this.cameras.main.startFollow(this.player.hero);
    }

    makeBoom(x, y) {
        new RockFall(this, x, y);
    }

    create() {
        this.config = this.game.config;
        this.exitExist = false;

        this.player = new Player(this, this.playerStats);
        this.map = new Map(this);
        this.hud = new Hud(this);


        this.cameraFollow();

        this.canPick = true;
        this.dragging = false;
        this.draw3 = new Draw3P({
            rows: this.map.rowsCount,
            columns: this.map.collCount,
            playerPosition: this.player.startPos,
        }, this);
        this.draw3.generateField();

        this.drawField();
        this.hud.activateFog();
        this.input.on("pointerdown", this.gemSelect, this);
        this.input.on("pointermove", this.drawPath, this);
        this.input.on("pointerup", this.removeGems, this);

        if (this.sounds === undefined) {
            this.intiSounds();
        }

        if (this.playerStats) {
            this.createDialog();
        }
    }

    intiSounds() {
        this.sounds = {
            chest: this.sound.add('chest', {volume: GameConfig.VOLUME_CHEST}),
            dig: this.sound.add('dig', {volume: GameConfig.VOLUME_DIG}),
            gameOver: this.sound.add('gameOver', {volume: GameConfig.VOLUME_GAME_OVER}),
            mine: this.sound.add('mine', {volume: GameConfig.VOLUME_MINE}),
            food: this.sound.add('food', {volume: GameConfig.VOLUME_FOOD}),
            rockFall: this.sound.add('rockFall', {volume: GameConfig.VOLUME_ROCK_FALL}),
            theme: this.sound.add('theme', {volume: GameConfig.VOLUME_MAIN_THEME, loop: true})
        };
        this.sounds.theme.play();
    }

    createDialog() {
        let frame = 0;
        let dialog = this.add.sprite(360, 1270, 'dialog').setScrollFactor(0).setOrigin(0.5, 1).setDepth(10);
        this.input.on('pointerdown', () => {
            if (dialog) {
                if (frame >= dialog.texture.frameTotal - 2) {
                    dialog.destroy();
                } else {
                    dialog.setFrame(++frame);
                }
            }
        });
    }

    drawField() {
        this.poolArray = [];
        this.arrowArray = [];
        for (let i = 0; i < this.draw3.getRows(); i++) {
            this.arrowArray[i] = [];
            for (let j = 0; j < this.draw3.getColumns(); j++) {
                let posX = GameConfig.CELL_SIZE + GameConfig.CELL_SIZE * j + GameConfig.CELL_SIZE / 2;
                let posY = GameConfig.CELL_SIZE + GameConfig.CELL_SIZE * i + GameConfig.CELL_SIZE / 2;

                if (this.draw3.isPlayerAt(i, j)) {
                    this.player.setPos(posX, posY);
                    var player = this.player.hero;
                }

                if (this.map.checkIsNonBlocked(i, j)) {
                    let item = this.draw3.isPlayerAt(i, j) ? player : this.add.sprite(posX, posY, 'resSet', this.draw3.valueAt(i, j));
                    item.setDepth(this.draw3.isPlayerAt(i, j) ? 1 : 0);
                    let arrow = this.add.sprite(posX, posY, 'arrow');
                    arrow.setDepth(2);
                    arrow.visible = false;
                    this.arrowArray[i][j] = arrow;
                    this.draw3.setCustomData(i, j, item);
                }
            }
        }
    }

    gemSelect(pointer) {
        if (this.canPick) {
            let row = Math.floor((pointer.worldY - GameConfig.CELL_SIZE) / GameConfig.CELL_SIZE);
            let col = Math.floor((pointer.worldX - GameConfig.CELL_SIZE) / GameConfig.CELL_SIZE);
            if (this.draw3.validPick(row, col)
                && this.draw3.isPlayerAt(row, col)
                && this.map.checkIsNonBlocked(row, col)) {

                this.canPick = false;
                this.draw3.putInChain(row, col)
                this.draw3.customDataOf(row, col).alpha = 0.5;
                this.dragging = true;
            }
        }
    }

    drawPath(pointer) {
        if (this.dragging) {
            this.player.hero.flipX = pointer.worldX > this.player.hero.x;

            let row = Math.floor((pointer.worldY - GameConfig.CELL_SIZE) / GameConfig.CELL_SIZE);
            let col = Math.floor((pointer.worldX - GameConfig.CELL_SIZE) / GameConfig.CELL_SIZE);
            if (this.map.checkIsNonBlocked(row, col) && this.draw3.validPick(row, col)) {
                let distance = Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, this.draw3.customDataOf(row, col).x, this.draw3.customDataOf(row, col).y);
                if (distance < GameConfig.CELL_SIZE * 0.4) {

                    if (this.draw3.continuesChain(row, col)) {
                        this.draw3.customDataOf(row, col).alpha = 0.5;
                        this.draw3.putInChain(row, col);
                        this.displayPath()
                    } else {
                        if (this.draw3.backtracksChain(row, col)) {
                            let removedItem = this.draw3.removeLastChainItem();
                            this.draw3.customDataOf(removedItem.row, removedItem.column).alpha = 1;
                            this.hidePath();
                            this.displayPath();
                        }
                    }
                }
            }
        }
    }

    nonRowedCell(id) {
        return id === GameConfig.EXIT_ID || id === GameConfig.GRIB_ID || id === GameConfig.CHEST_ID;
    }

    removeGems() {
        if (this.dragging) {
            this.hidePath();
            this.dragging = false;
            let id = -1;
            if (this.draw3.getChainLength() > 1) {
                id = this.draw3.getChainValue();
            }
            if (this.draw3.getChainLength() < 3 && (!this.nonRowedCell(id))) {
                let chain = this.draw3.emptyChain();
                chain.forEach(function (item) {
                    this.draw3.customDataOf(item.row, item.column).alpha = 1;
                }.bind(this));
                this.canPick = true;
            } else {
                this.playerStep();
                this.player.move();
                if (id === GameConfig.EXIT_ID) {
                    this.player.exit();
                }
            }
        }
    }

    playerStep() {
        let playerMovement = this.draw3.movePlayer();
        if (playerMovement) {
            let player = this.draw3.customDataOf(playerMovement.from.row, playerMovement.from.column);
            var item = this.draw3.customDataOf(playerMovement.to.row, playerMovement.to.column);
            this.player.collect(item.frame.name);
            player.alpha = 1;
            let posX = player.x + (playerMovement.from.column - playerMovement.to.column) * GameConfig.CELL_SIZE;
            let posY = player.y + (playerMovement.from.row - playerMovement.to.row) * GameConfig.CELL_SIZE;
            this.tweens.add({
                targets: player,
                x: posX,
                y: posY,
                duration: gameOptions.moveSpeed,
                callbackScope: this,
                onComplete: function () {
                    this.poolArray.push(item);
                    this.draw3.customDataOf(playerMovement.to.row, playerMovement.to.column).alpha = 0;
                    this.playerStep();
                }
            })
        } else {
            this.makeGemsFall();
        }
    }

    makeGemsFall() {
        let moved = 0;
        this.canPick = true;
        let replenishMovements = this.draw3.replenishBoard();
        replenishMovements.forEach(function (movement) {
            moved++;
            let sprite = this.poolArray.pop();
            if (sprite) {
                sprite.alpha = 1;
                sprite.y = GameConfig.CELL_SIZE * movement.row + GameConfig.CELL_SIZE / 2;
                sprite.x = GameConfig.CELL_SIZE + GameConfig.CELL_SIZE * movement.column + GameConfig.CELL_SIZE / 2,
                    sprite.setFrame(this.draw3.valueAt(movement.row, movement.column));
                sprite.setScale(GameConfig.DROP_BLOCK_SCALE_SIZE);
                this.draw3.setCustomData(movement.row, movement.column, sprite);
                this.tweens.add({
                    targets: sprite,
                    y: GameConfig.CELL_SIZE + GameConfig.CELL_SIZE * movement.row + GameConfig.CELL_SIZE / 2,
                    scale: 1,
                    duration: GameConfig.DROP_BLOCK_SPEED * movement.deltaRow,
                    callbackScope: this,
                    onComplete: function () {
                        this.makeBoom(sprite.x, sprite.y);
                        moved--;
                        if (moved == 0) {
                            this.canPick = true;
                        }
                    }
                });
            }
        }.bind(this))
    }

    displayPath() {
        let path = this.draw3.getPath();
        path.forEach(function (item) {
            this.arrowArray[item.row][item.column].visible = true;
            if (!this.draw3.isDiagonal(item.direction)) {
                this.arrowArray[item.row][item.column].setFrame(0);
                this.arrowArray[item.row][item.column].angle = 90 * Math.log2(item.direction);
            } else {
                this.arrowArray[item.row][item.column].setFrame(1);
                this.arrowArray[item.row][item.column].angle = 90 * (item.direction - 9 + ((item.direction < 9) ? (item.direction / 3) - 1 - item.direction % 2 : 0));
            }
        }.bind(this))
    }

    hidePath() {
        this.arrowArray.forEach(function (item) {
            item.forEach(function (subItem) {
                subItem.visible = false;
                subItem.angle = 0;
            })
        })
    }

    update(time, dt) {
        if (this.hud.fog.activated) {
            this.hud.fog.x = this.player.hero.x;
            this.hud.fog.y = this.player.hero.y;
        }
        this.hud.render();
    }

}