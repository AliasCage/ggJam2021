export default class Map {
    constructor(scene) {
        this.scene = scene;
        this.init();
        this.create();
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

}