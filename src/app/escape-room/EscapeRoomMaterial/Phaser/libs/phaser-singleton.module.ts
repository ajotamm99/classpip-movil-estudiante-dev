import { SesionService } from './../../../../servicios/sesion.service';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, NgZone, Optional, SkipSelf } from '@angular/core';
//import { SwordTypeEnum } from '@company-name/shared/data-access-model';
import * as Phaser from 'phaser';
import { Subject } from 'rxjs';
import { WorldScene } from './scenes/world.scene';
import { LoadingScene } from './scenes/LoadingScene.scene'
import { PeticionesAPIService } from 'src/app/servicios';
//import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Alumno } from 'src/app/clases';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

/**
 * * The PhaserInstance is a singleton that controls the Game Scene, which is the UI portion of the Game Engine
 */

@NgModule({
    imports: [CommonModule
      ],
    declarations: [],
    exports: [],
})
export class PhaserSingletonService {
    // * We need the Phaser.Game to live inside our own class because extending Phaser.Game would require a super call
    public static activeGame: Phaser.Game;
    private static ngZone: NgZone;
    public static actionsHistory: string[] = []; // * Since phaser is a singleton, let's store the history of actions here for all components.
    
    //public static shopObservable: Subject<SwordTypeEnum> = new Subject<SwordTypeEnum>();

    constructor(
        private ngZone: NgZone, @Optional() @SkipSelf() parentModule?: PhaserSingletonService) {
        if (parentModule) {
            console.error('Phaser Singleton is already loaded. Import it in the AppModule only');
        } else {
            PhaserSingletonService.ngZone = this.ngZone;
            PhaserSingletonService.actionsHistory.push('Initializing Phaser...');
        }
    }

    /**
     * * This function is required for singleton instance
     *
     * @returns PhaserSingletonService & List of Providers
     */
    public static forRoot(): ModuleWithProviders<PhaserSingletonService> {
        return {
            ngModule: PhaserSingletonService,
            providers: [],
        };
    }

    /**
     * * When A user Logs out, destroy the active game.
     */
    public static destroyActiveGame(): void {
        //* Param 1: Set to true if you would like the parent canvas element removed from the DOM.
        //* Param 2: Set to false  If you do need to create another game instance on the same page
        if (PhaserSingletonService.activeGame) {
            PhaserSingletonService.activeGame.destroy(true, false);
            //this.ngZone.run;
        }
    }

    /**
     * * Initializes the active Phaser.Game
     * * The Phaser.Game instance owns Scene Manager, Texture Manager, Animations FrameHandler, and Device Class as GLOBALS
     * * The Scene Manager owns the individual Scenes and is accessed by activeGame.scene
     * * Each Scene owns it's own "world", which includes all game objects.
     * ! GameInstance must be the parent class to scenes.
     * ! Should only be called *when* we want it to load in memory.  I.e. during simulation.
     */
    public async init(): Promise<void> {
        
        /**
         * * Phaser by default runs at 60 FPS, and each frame that triggers change detection in Angular which causes
         * * Performance to go out the door.  NgZone's runOutsideAngular will prevent Phaser from automatically hitting change detection
         * * https://angular.io/guide/zone
         */
        console.log("running singleton");
        var alumnos: any;
        /*PhaserSingletonService.ngZone.runOutsideAngular(() => {*/
        localStorage.setItem('1map','http://localhost:3000/api/imagenes/ArchivosEscenas/download/escena.json')
        localStorage.setItem('1tiles','http://localhost:3000/api/imagenes/ImagenesEscenas/download/mainlevbuild.png')
        

            if (!PhaserSingletonService.activeGame) {
                // To scale game to always fit in parent container
                // https://photonstorm.github.io/phaser3-docs/Phaser.Scale.ScaleManager.html
                PhaserSingletonService.activeGame = new Phaser.Game({
                    type: Phaser.AUTO,
                    scale: {
                        mode: Phaser.Scale.RESIZE,
                        width: window.innerWidth,
                        autoCenter: Phaser.Scale.CENTER_BOTH,
                        height: window.innerHeight,
                    },
                    parent: 'phaser-example',
                    physics: {
                        default: 'arcade',
                        arcade: {
                            gravity: { y: 200 }
                        }
                    },
                    scene: [LoadingScene, WorldScene],
                    render: {
                        transparent: false,
                        pixelArt: true,
                    },
                    /*type: Phaser.AUTO,
                    scale: {
                        mode: Phaser.Scale.RESIZE,
                        width: window.innerWidth,
                        autoCenter: Phaser.Scale.CENTER_BOTH,
                        height: window.innerHeight,
                    },
                    parent: 'phaser-example',
                    scene: [WorldScene],
                    plugins: {
                        global: [],
                        scene: [],
                    },
                    fps: {
                        forceSetTimeOut: true,
                    },
                    render: {
                        transparent: false,
                    },*/
                });
            }
            
        }

   

    /**
     * * gets the actionsHistory
     *
     * @returns string[]
     */
    public static getActionsHistory(): string[] {
        return PhaserSingletonService.actionsHistory;
    }
}