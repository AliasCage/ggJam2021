import * as GameConfig from '../classes/GameConfig';

export default class Map {
    constructor(scene) {
        this.scene = scene;
        this.init();
        this.create();
        this.initPlayerPos();
    }

    init() {
        this.tilemap = this.scene.make.tilemap({key: 'lvl_' + this.scene.player.level});
        this.tileset = this.tilemap.addTilesetImage('blocks', 'blocksSet', 100, 100, 0, 0);
        this.rowsCount = this.tilemap.height - 2;
        this.collCount = this.tilemap.width - 2;
        this.getExit();
    }

    create() {
        this.createLayers();
    }

    createLayers() {
        this.tilemap.createStaticLayer('ground', this.tileset);
        this.tilemap.createStaticLayer('blocks', this.tileset);
    }

    initPlayerPos() {
        this.tilemap.findObject('player', player => {
            this.scene.player.startPos.row = Math.floor(player.y / GameConfig.CELL_SIZE) - 1;
            this.scene.player.startPos.column = Math.floor(player.x / GameConfig.CELL_SIZE) - 1;
        });
    }

    checkIsNonBlocked(coll, row) {
        let posX = GameConfig.CELL_SIZE + row * GameConfig.CELL_SIZE;
        let posY = GameConfig.CELL_SIZE + coll * GameConfig.CELL_SIZE;
        let tile = this.tilemap.getTileAtWorldXY(posX, posY, false, this.scene.cameras.main, 'blocks');
        return tile === undefined || tile === null;
    }

    getExit() {
        let layer = this.tilemap.objects[1];
        if (layer && layer.name === 'exits') {
            let id = Math.floor(Math.random() * layer.objects.length);
            let exit = layer.objects[id];
            let row = Math.floor(exit.y / GameConfig.CELL_SIZE) - 1;
            let col = Math.floor(exit.x / GameConfig.CELL_SIZE) - 1;
            return {row: row, column: col};
        }
        return undefined;
    }
}