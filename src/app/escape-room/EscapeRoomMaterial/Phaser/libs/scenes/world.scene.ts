//import { Blacksmith, CheapSword, FancySword, Sword } from '@company-name/shared/data-access-model';
import * as Phaser from 'phaser';

import { ScrollManager } from '../utilities/scroll-manager';

export class WorldScene extends Phaser.Scene {
    private backgroundKey = 'background-image'; // * Store the background image name
    private backgroundImageAsset = '/assets/prueba.jpeg'; // * Asset url relative to the app itself
    private backgroundImage: Phaser.GameObjects.Image; // * Reference for the background image
    private scrollManager: ScrollManager; // * Custom openforge utility for handling scroll
    

    constructor() {
        super({ key: 'preloader' });
    }

    async preload(): Promise<void> {
        this.load.setBaseURL('http://labs.phaser.io');
        
                this.load.image('sky', 'assets/skies/space3.png');
                this.load.image('logo', 'assets/sprites/phaser3-logo.png');
                this.load.image('red', 'assets/particles/red.png');
    }

    /**
     * * Load the blacksmith sprites
     */
    

    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    async create(): Promise<void> {
        this.add.image(400, 300, 'sky');
        
        var particles = this.add.particles('red');

        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        var logo = this.physics.add.image(400, 100, 'logo');

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);
    }

    /**
     * * When the screen is resized, we
     *
     * @param gameSize
     */
    resize(gameSize: Phaser.Structs.Size): void {
        console.log('Resizing', gameSize.width, gameSize.height);
        this.cameras.resize(gameSize.width, gameSize.height);
    }
}