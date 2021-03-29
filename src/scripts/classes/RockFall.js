import Phaser from "phaser";
import * as GameConfig from "./GameConfig";

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'boom', 'b1');
        scene.add.existing(this);

        this.setDepth(5);
        // Сгенерировать набор фреймов текстуры, необходимых для анимации
        const frames = this.anims.generateFrameNames('boom', {
            prefix: 'b',
            start: 1,
            end: 8
        });

        // Создать новую анимацию на основе полученного набора фреймов
        scene.anims.create({
            key: 'boom',
            frames,
            frameRate: GameConfig.FRAME_RATE_BOOM,
            repeat: 0
        });

        // Запустить анимацию
        scene.sounds.rockFall.play();
        this.play('boom').once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.destroy();
        });
    }
}
