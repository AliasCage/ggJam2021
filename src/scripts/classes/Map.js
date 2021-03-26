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
        console.log(this.tilemap)
        this.tilemap.createStaticLayer('ground', this.tileset);
        this.tilemap.createStaticLayer('blocks', this.tileset);
    }

    checkIsNonBlocked(row, coll) {
        let tile = this.tilemap.getTileAtWorldXY(row * 100, coll * 100, false, this.scene.cameras.main, 'blocks');
        return tile === undefined || tile === null;
    }

    createCollision() {
        this.tilemap.findObject('collisions', collision => {
            const sprite = this.scene.matter.add.sprite(collision.x + collision.width / 2, collision.y - collision.height / 2, 'objects', collision.name);
            sprite.setStatic(true);
        });
    }

    createOils() {
        this.tilemap.findObject('oils', oil => {
            const sprite = this.scene.matter.add.sprite(oil.x + oil.width / 2, oil.y - oil.height / 2, 'objects', 'oil');
            sprite.setStatic(true);
            sprite.setSensor(true);
        });
    }

    createCheckpoints() {
        this.checkpoints = [];

        this.tilemap.findObject('checkpoints', checkpoint => {
            let rectangle = new Phaser.Geom.Rectangle(checkpoint.x, checkpoint.y, checkpoint.width, checkpoint.height);
            rectangle.index = checkpoint.properties.find(property => property.name === 'value').value;
            this.checkpoints.push(rectangle);
        });
    }

    getPlayerPosition(positionName) {
        return this.tilemap.findObject(positionName, position => {
            return position.name === positionName;
        });
    }

    getTileFriction(car) {
        for (let road in ROADS_FRICTION) {
            let tile = this.tilemap.getTileAtWorldXY(car.x, car.y, false, this.scene.cameras.main, road);
            if (tile) {
                return ROADS_FRICTION[road];
            }
        }

        return GRASS_FRICTION;
    }

    getCheckpoint(car) {
        const checkpoint = this.checkpoints.find(checkpoint => checkpoint.contains(car.x, car.y));
        return checkpoint ? parseInt(checkpoint.index) : false;
    }
}