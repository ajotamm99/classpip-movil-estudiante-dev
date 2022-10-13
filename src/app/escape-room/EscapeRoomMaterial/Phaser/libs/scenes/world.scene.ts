import { SesionService } from './../../../../../servicios/sesion.service';
//import { Blacksmith, CheapSword, FancySword, Sword } from '@company-name/shared/data-access-model';
import * as Phaser from 'phaser';

import { ScrollManager } from '../utilities/scroll-manager';
import { PeticionesAPIService } from 'src/app/servicios';

export class WorldScene extends Phaser.Scene {
    private backgroundKey = 'background-image'; // * Store the background image name
    private backgroundImageAsset = '/assets/prueba.jpeg'; // * Asset url relative to the app itself
    private backgroundImage: Phaser.GameObjects.Image; // * Reference for the background image
    

    constructor(private sesion: SesionService, private peticionesApi: PeticionesAPIService) {
        super({ key: 'main' });
    }

    async preload(): Promise<void> {

        //this.load.setBaseURL('http://labs.phaser.io');

        // this.load.setBaseURL('http://labs.phaser.io');
        
        //this.load.image('tiles', 'http://localhost:3000/api/imagenes/ImagenesEscenas/download/mainlevbuild.png');
        //this.load.tilemapTiledJSON('map', 'http://localhost:3000/api/imagenes/ArchivosEscenas/download/escena.json');
        //this.load.image('red', 'assets/particles/red.png');
    }

    /**
     * * Load the blacksmith sprites
     */
    

    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    async create(): Promise<void> {
        this.scene.start()

        //var map=this.make.tilemap({key:'map'});
        //var tilesheet=map.addTilesetImage('tilesetincial','tiles');
        
        //var layer1 = map.createLayer('suelo',tilesheet);
        //var solid= map.createLayer('solid', tilesheet);


    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    //var tiles = map.addTilesetImage('cybernoid', 'tiles');

    // You can load a layer from the map using the layer name from Tiled, or by using the layer
    // index (0 in this case).
    //var layer = map.createLayer(0, tiles, 0, 0);

        //solid.setCollisionByProperty({collides: true});
        //const debug=this.add.graphics().setAlpha(0.7);
        //solid.renderDebug(debug,
           //{tileColor:null,
               // collidingTileColor:new Phaser.Display.Color(255,100,100,255),
               // faceColor: new Phaser.Display.Color(40,39,37,255),


            


        // this.add.image(400, 300, 'sky');
        
        // var particles = this.add.particles('red');

        // var emitter = particles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });

        // var logo = this.physics.add.image(400, 100, 'logo');

        // logo.setVelocity(100, 200);
        // logo.setBounce(1, 1);
        // logo.setCollideWorldBounds(true);

        // emitter.startFollow(logo);
    }


}