class Cap extends Phaser.GameObjects.Sprite {
    constructor(scene,x, y, value) {
        super(scene, x, y, 'cap');
        this.scene = scene;
        this.value = value;
        this.scene.add.existing(this);
        this.setInteractive();
    }

    init(position) {
        this.position = position;
        this.close();
        this.setPosition(-this.width, -this.height);
    }
}