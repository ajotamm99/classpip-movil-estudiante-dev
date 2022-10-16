import { SesionService } from '../../../../../servicios/sesion.service';
//import { Blacksmith, CheapSword, FancySword, Sword } from '@company-name/shared/data-access-model';
import * as Phaser from 'phaser';

import { PeticionesAPIService } from 'src/app/servicios';

export class BootScene extends Phaser.Scene {
    private backgroundKey = 'background-image'; // * Store the background image name
    private backgroundImageAsset = '/assets/prueba.jpeg'; // * Asset url relative to the app itself
    private backgroundImage: Phaser.GameObjects.Image; // * Reference for the background image
    

    constructor(private sesion: SesionService, private peticionesApi: PeticionesAPIService) {
        super({ key: 'boot' });
    }

    preload() {
        this.load.image('fondo','http://localhost:8100/assets/icon/classpip2.png');
        this.load.image('bag', 'http://localhost:8100/assets/escaperoom/bagEscapeRoom.png');

    }
    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    create() {
        this.scene.start('preloader');

    }


}