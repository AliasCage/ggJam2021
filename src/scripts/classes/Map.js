import * as GameConfig from '../classes/GameConfig';

export default class Map {
    constructor(scene) {
        this.scene = scene;
        this.init();
        this.create();
        this.initPlayerPos();
    }

    init() {
        this.tilemap = this.scene.make.tilemap({key: 'undergroundJson'});
        this.tileset = this.tilemap.addTilesetImage('blocks', 'blocksSet', 100, 100, 0, 0);
        this.rowsCount = this.tilemap.height - 2;
        this.collCount = this.tilemap.width - 2;
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
            this.scene.player.startPos.row = Math.floor(player.x / GameConfig.CELL_SIZE);
            this.scene.player.startPos.column = Math.floor(player.y / GameConfig.CELL_SIZE);
        });
    }

    checkIsNonBlocked(coll, row) {
        let posX = GameConfig.CELL_SIZE + row * GameConfig.CELL_SIZE;
        let posY = GameConfig.CELL_SIZE + coll * GameConfig.CELL_SIZE;
        let tile = this.tilemap.getTileAtWorldXY(posX, posY, false, this.scene.cameras.main, 'blocks');
        return tile === undefined || tile === null;
    }
}