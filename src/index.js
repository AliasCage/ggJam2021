import Phaser from "phaser";
import BootScene from './scripts/scenes/BootScene';
import PreloadScene from './scripts/scenes/PreloadScene';
import StartScene from './scripts/scenes/StartScene';
import GameScene from './scripts/scenes/GameScene';

const config = {
    type: Phaser.AUTO,
    width: 720,
    height: 1280,
    widthMiddle: 360,
    heightMiddle: 640,
    debug: true,
    scene: [BootScene, PreloadScene, StartScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);