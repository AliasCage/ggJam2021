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
            this.scene.player.startPos.coll = Math.floor(player.y / GameConfig.CELL_SIZE);
        });
    }

}