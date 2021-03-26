import Phaser from "phaser";
import Map from '../classes/Map';
import Draw3P from '../classes/Draw3P';
import Player from '../classes/Player';
import Hud from '../classes/Hud';

const ITEMS_COUNT = 6;

let gameOptions = {
    gemSize: 100,
    fallSpeed: 100,
    destroySpeed: 200,
    moveSpeed: 100,
    boardOffset: {
        x: 100,
        y: 100
    }
}

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init(data) {

    }

    preload() {
        this.createBackground();
    }

    createBackground() {
        // this.add.sprite(0, 0, 'bg').setOrigin(0);
    }

    cameraFollow() {
        this.cameras.main.setBounds(0, 0, this.map.tilemap.widthInPixels, this.map.tilemap.heightInPixels);
        this.cameras.main.startFollow(this.player.hero);
    }

    create() {
        this.config = this.game.config;
        this.exitExist = false;

        this.map = new Map(this);
        this.hud = new Hud(this);
        this.player = new Player(this);

        this.cameraFollow();

        this.canPick = true;
        this.dragging = false;
        this.draw3 = new Draw3P({
            rows: 19,
            columns: 19,
            items: ITEMS_COUNT,
            playerPosition: {
                row: 9,
                column: 7
            }
        }, this);
        this.draw3.generateField();
        this.drawField();
        this.input.on("pointerdown", this.gemSelect, this);
        this.input.on("pointermove", this.drawPath, this);
        this.input.on("pointerup", this.removeGems, this);
    }

    drawField() {
        this.poolArray = [];
        this.arrowArray = [];
        for (let i = 0; i < this.draw3.getRows(); i++) {
            this.arrowArray[i] = [];
            for (let j = 0; j < this.draw3.getColumns(); j++) {
                let posX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
                let posY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2;

                if (this.draw3.isPlayerAt(i, j)) {
                    this.player.setPos(posX, posY);
                    var player = this.player.hero;
                }

                let item = this.draw3.isPlayerAt(i, j) ? player : this.add.sprite(posX, posY, 'resSet', this.draw3.valueAt(i, j));
                // item.setVisible(this.map.checkIsNonBlocked(i, j))
                item.setDepth(this.draw3.isPlayerAt(i, j) ? 1 : 0);
                let arrow = this.add.sprite(posX, posY, 'arrow');
                arrow.setDepth(2);
                arrow.visible = false;
                this.arrowArray[i][j] = arrow;
                this.draw3.setCustomData(i, j, item);
            }
        }
    }

    gemSelect(pointer) {
        if (this.canPick) {
            let row = Math.floor((pointer.worldY - gameOptions.boardOffset.y) / gameOptions.gemSize);
            let col = Math.floor((pointer.worldX - gameOptions.boardOffset.x) / gameOptions.gemSize);
            // var nonBlocked = this.map.checkIsNonBlocked(row, col);

            var validPick = this.draw3.validPick(row, col);
            var isPlayer = this.draw3.isPlayerAt(row, col);
            if (validPick && isPlayer) {
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

            let row = Math.floor((pointer.worldY - gameOptions.boardOffset.y) / gameOptions.gemSize);
            let col = Math.floor((pointer.worldX - gameOptions.boardOffset.x) / gameOptions.gemSize);
            // var nonBlocked = this.map.checkIsNonBlocked(row, col);
            if (this.draw3.validPick(row, col)) {
                let distance = Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, this.draw3.customDataOf(row, col).x, this.draw3.customDataOf(row, col).y);
                if (distance < gameOptions.gemSize * 0.4) {

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
        return id === 3 || id === 4 || id === 5;
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
                this.player.hero.emit('move');
                if (this.nonRowedCell(id)) {
                    this.player.hero.emit('exit');
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
            this.tweens.add({
                targets: player,
                x: player.x + (playerMovement.from.column - playerMovement.to.column) * gameOptions.gemSize,
                y: player.y + (playerMovement.from.row - playerMovement.to.row) * gameOptions.gemSize,
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
        let fallingMovements = this.draw3.arrangeBoardAfterChain();
        fallingMovements.forEach(function (movement) {
            moved++;
            let posY = this.draw3.customDataOf(movement.row, movement.column).y + movement.deltaRow * gameOptions.gemSize;
            this.tweens.add({
                targets: this.draw3.customDataOf(movement.row, movement.column),
                y: posY,
                duration: gameOptions.fallSpeed * Math.abs(movement.deltaRow),
                callbackScope: this,
                onComplete: function () {
                    moved--;
                    if (moved == 0) {
                        this.canPick = true;
                    }
                }
            })
        }.bind(this));
        let replenishMovements = this.draw3.replenishBoard();
        replenishMovements.forEach(function (movement) {
            moved++;
            let sprite = this.poolArray.pop();
            sprite.alpha = 1;
            sprite.y = gameOptions.boardOffset.y + gameOptions.gemSize * (movement.row - movement.deltaRow + 1) - gameOptions.gemSize / 2;
            sprite.x = gameOptions.boardOffset.x + gameOptions.gemSize * movement.column + gameOptions.gemSize / 2,
                sprite.setFrame(this.draw3.valueAt(movement.row, movement.column));

            this.draw3.setCustomData(movement.row, movement.column, sprite);
            this.tweens.add({
                targets: sprite,
                y: gameOptions.boardOffset.y + gameOptions.gemSize * movement.row + gameOptions.gemSize / 2,
                duration: gameOptions.fallSpeed * movement.deltaRow,
                callbackScope: this,
                onComplete: function () {
                    moved--;
                    if (moved == 0) {
                        this.canPick = true;
                    }
                }
            });
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
        this.hud.fog.x = this.player.hero.x;
        this.hud.fog.y = this.player.hero.y;
        this.hud.render();
    }

}